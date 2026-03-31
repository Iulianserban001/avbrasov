// ============================================================
// Main Analyzer Orchestrator
// ============================================================

import type { Page, AnalysisScores, AnalysisIssue, InternalLink, PageAnalysis } from "@/types";
import type { AnalyzerInput, FullAnalysisResult } from "./types";
import { analyzeSeoScore } from "./seo-score";
import { analyzeTechnicalSeo } from "./technical-score";
import { analyzeContentQuality } from "./content-quality";
import { analyzeEeatScore } from "./eeat-score";
import {
  analyzeLocalRelevance,
  analyzeAiReadiness,
  analyzeConversionClarity,
  analyzeInternalLinking,
  analyzeFreshness,
  analyzeRisk,
} from "./remaining-scores";
import { generateId } from "@/lib/utils";

const DIMENSION_WEIGHTS = {
  seoScore: 0.15,
  technicalSeoScore: 0.10,
  contentQualityScore: 0.15,
  eeatScore: 0.15,
  localRelevanceScore: 0.10,
  aiSearchReadiness: 0.08,
  conversionClarityScore: 0.10,
  internalLinkingScore: 0.07,
  freshnessScore: 0.05,
  riskScore: 0.05, // Inverted in overall calculation
};

export function analyzePage(
  page: Page,
  allPages: Page[],
  internalLinks: InternalLink[],
  siteSettings?: { firmName: string; firmPhone: string; firmAddress: string }
): FullAnalysisResult {
  const input: AnalyzerInput = { page, allPages, internalLinks, siteSettings };

  // Run all 10 dimensions
  const seo = analyzeSeoScore(input);
  const technical = analyzeTechnicalSeo(input);
  const content = analyzeContentQuality(input);
  const eeat = analyzeEeatScore(input);
  const local = analyzeLocalRelevance(input);
  const ai = analyzeAiReadiness(input);
  const conversion = analyzeConversionClarity(input);
  const linking = analyzeInternalLinking(input);
  const freshness = analyzeFreshness(input);
  const risk = analyzeRisk(input);

  const scores: AnalysisScores = {
    seoScore: Math.round(seo.score),
    technicalSeoScore: Math.round(technical.score),
    contentQualityScore: Math.round(content.score),
    eeatScore: Math.round(eeat.score),
    localRelevanceScore: Math.round(local.score),
    aiSearchReadiness: Math.round(ai.score),
    conversionClarityScore: Math.round(conversion.score),
    internalLinkingScore: Math.round(linking.score),
    freshnessScore: Math.round(freshness.score),
    riskScore: Math.round(risk.score),
    overallScore: 0, // Calculated below
  };

  // Calculate overall score (risk is inverted: 100 - risk)
  scores.overallScore = Math.round(
    scores.seoScore * DIMENSION_WEIGHTS.seoScore +
    scores.technicalSeoScore * DIMENSION_WEIGHTS.technicalSeoScore +
    scores.contentQualityScore * DIMENSION_WEIGHTS.contentQualityScore +
    scores.eeatScore * DIMENSION_WEIGHTS.eeatScore +
    scores.localRelevanceScore * DIMENSION_WEIGHTS.localRelevanceScore +
    scores.aiSearchReadiness * DIMENSION_WEIGHTS.aiSearchReadiness +
    scores.conversionClarityScore * DIMENSION_WEIGHTS.conversionClarityScore +
    scores.internalLinkingScore * DIMENSION_WEIGHTS.internalLinkingScore +
    scores.freshnessScore * DIMENSION_WEIGHTS.freshnessScore +
    (100 - scores.riskScore) * DIMENSION_WEIGHTS.riskScore
  );

  // Collect all issues, sorted by severity then impact
  const allIssues = [
    ...seo.issues,
    ...technical.issues,
    ...content.issues,
    ...eeat.issues,
    ...local.issues,
    ...ai.issues,
    ...conversion.issues,
    ...linking.issues,
    ...freshness.issues,
    ...risk.issues,
  ].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 };
    const impactOrder = { high: 0, medium: 1, low: 2 };
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return impactOrder[a.impact] - impactOrder[b.impact];
  });

  return { scores, issues: allIssues };
}

export function createPageAnalysis(
  pageId: string,
  page: Page,
  allPages: Page[],
  internalLinks: InternalLink[]
): PageAnalysis {
  const result = analyzePage(page, allPages, internalLinks);
  return {
    id: generateId(),
    pageId,
    pageTitle: page.title,
    pageSlug: page.slug,
    scores: result.scores,
    issues: result.issues,
    analyzedAt: new Date().toISOString(),
  };
}

// Publishing guardrails — check if page can be published
export interface PublishGuardrailResult {
  canPublish: boolean;
  blockers: string[];
  warnings: string[];
}

export function checkPublishingGuardrails(
  page: Page,
  analysis: FullAnalysisResult
): PublishGuardrailResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  // Minimum uniqueness — risk score must be below 50
  if (analysis.scores.riskScore >= 50) {
    blockers.push("Scorul de risc este prea ridicat (posibil conținut duplicat sau doorway page).");
  }

  // Minimum content quality
  if (analysis.scores.contentQualityScore < 40) {
    blockers.push("Calitatea conținutului este sub pragul minim (40 puncte).");
  }

  // Minimum trust
  if (analysis.scores.eeatScore < 30) {
    blockers.push("Semnalele E-E-A-T sunt insuficiente (sub 30 puncte).");
  }

  // Local relevance for locality pages
  if (page.pageType === "LOCALITY" && analysis.scores.localRelevanceScore < 40) {
    blockers.push("Relevanța locală este sub pragul minim pentru pagini de localitate.");
  }

  // Mandatory reviewer for YMYL
  if (["SERVICE_HUB", "SERVICE_DETAIL", "MONEY_PAGE", "GUIDE", "LOCALITY"].includes(page.pageType)) {
    if (!page.reviewerId) {
      blockers.push("Un reviewer legal este obligatoriu pentru conținut YMYL.");
    }
  }

  // Meta completeness
  if (!page.title || !page.metaDescription || !page.h1) {
    blockers.push("Metadatele sunt incomplete (titlu, descriere, sau H1 lipsesc).");
  }

  // Thin content
  const words = page.content.map((b) => b.content).join(" ").split(/\s+/).length;
  if (words < 200 && !["CONTACT", "LEGAL_PAGE"].includes(page.pageType)) {
    blockers.push(`Conținut prea scurt (${words} cuvinte).`);
  }

  // Warnings
  if (analysis.scores.seoScore < 60) {
    warnings.push("Scorul SEO este sub 60 — recomandat îmbunătățiri.");
  }
  if (analysis.scores.internalLinkingScore < 40) {
    warnings.push("Linking-ul intern este slab — adăugați linkuri relevante.");
  }
  if (!page.legalDisclaimer) {
    warnings.push("Disclaimerul legal lipsește.");
  }

  return {
    canPublish: blockers.length === 0,
    blockers,
    warnings,
  };
}
