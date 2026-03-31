// ============================================================
// Technical SEO Score Analyzer (Dimension 2)
// ============================================================

import type { AnalysisIssue } from "@/types";
import type { AnalyzerInput, DimensionResult } from "./types";

export function analyzeTechnicalSeo(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const issues: AnalysisIssue[] = [];
  let totalScore = 0;

  // Indexability (20%)
  if (!page.noIndex) {
    totalScore += 20;
  } else {
    issues.push({ id: "tech-noindex", category: "SEO Tehnic", severity: "warning", message: "Pagina este setată ca noindex.", recommendation: "Verificați dacă noindex este intenționat.", impact: "high", dimension: "technicalSeoScore" });
  }

  // Canonical consistency (15%)
  if (!page.canonicalUrl || page.canonicalUrl.includes(page.slug)) {
    totalScore += 15;
  } else {
    totalScore += 8;
    issues.push({ id: "tech-canonical", category: "SEO Tehnic", severity: "warning", message: "Canonical URL diferă de URL-ul paginii.", recommendation: "Folosiți self-referencing canonical dacă nu există motiv de consolidare.", impact: "medium", dimension: "technicalSeoScore" });
  }

  // Internal link count (15%)
  const outboundLinks = input.internalLinks.filter((l) => l.sourcePageId === page.id);
  if (outboundLinks.length >= 5) {
    totalScore += 15;
  } else if (outboundLinks.length >= 3) {
    totalScore += 10;
    issues.push({ id: "tech-links-low", category: "SEO Tehnic", severity: "info", message: `Doar ${outboundLinks.length} linkuri interne (recomandat 5+).`, recommendation: "Adăugați linkuri interne relevante.", impact: "low", dimension: "technicalSeoScore" });
  } else {
    totalScore += 3;
    issues.push({ id: "tech-links-min", category: "SEO Tehnic", severity: "warning", message: `Foarte puține linkuri interne (${outboundLinks.length}).`, recommendation: "Fiecare pagină ar trebui să aibă minim 3-5 linkuri interne.", impact: "medium", dimension: "technicalSeoScore" });
  }

  // Schema.org presence (15%)
  if (page.schemaType && page.schemaData) {
    totalScore += 15;
  } else if (page.schemaType) {
    totalScore += 8;
    issues.push({ id: "tech-schema-partial", category: "SEO Tehnic", severity: "info", message: "Schema tip definit dar datele sunt incomplete.", recommendation: "Completați datele schema.org.", impact: "medium", dimension: "technicalSeoScore" });
  } else {
    issues.push({ id: "tech-schema-miss", category: "SEO Tehnic", severity: "warning", message: "Schema.org lipsește.", recommendation: "Adăugați markup JSON-LD relevant (LegalService, FAQPage, etc.).", impact: "high", dimension: "technicalSeoScore" });
  }

  // Mobile-friendly structure (10%)
  // Since we control the templates, we can assume mobile-friendly
  totalScore += 10;

  // Broken internal links (15%)
  const allPageIds = new Set(input.allPages.map((p) => p.id));
  const brokenLinks = outboundLinks.filter((l) => !allPageIds.has(l.targetPageId));
  if (brokenLinks.length === 0) {
    totalScore += 15;
  } else {
    totalScore += 5;
    issues.push({ id: "tech-broken", category: "SEO Tehnic", severity: "critical", message: `${brokenLinks.length} linkuri interne rupte.`, recommendation: "Reparați sau eliminați linkurile rupte.", impact: "high", dimension: "technicalSeoScore" });
  }

  // Breadcrumbs (10%)
  if (page.breadcrumbs && page.breadcrumbs.length > 0) {
    totalScore += 10;
  } else {
    totalScore += 3;
    issues.push({ id: "tech-breadcrumb", category: "SEO Tehnic", severity: "info", message: "Breadcrumb-urile lipsesc.", recommendation: "Adăugați breadcrumb-uri pentru navigare și schema.", impact: "low", dimension: "technicalSeoScore" });
  }

  return { score: Math.min(100, totalScore), issues };
}
