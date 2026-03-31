// ============================================================
// E-E-A-T Score Analyzer (Dimension 4)
// ============================================================

import type { AnalysisIssue } from "@/types";
import type { AnalyzerInput, DimensionResult } from "./types";

export function analyzeEeatScore(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const issues: AnalysisIssue[] = [];
  let totalScore = 0;

  // Author assigned (20%)
  if (page.authorId && page.authorName) {
    totalScore += 20;
  } else {
    totalScore += 0;
    issues.push({ id: "eeat-author", category: "E-E-A-T", severity: "critical", message: "Autorul lipsește de pe pagină.", recommendation: "Atribuiți un autor cu profil vizibil.", impact: "high", dimension: "eeatScore" });
  }

  // Author credentials (15%)
  // We can only check if authorName exists and page has trust signals
  if (page.authorId) {
    totalScore += 15; // Assume credentials are set if author exists
  } else {
    issues.push({ id: "eeat-cred", category: "E-E-A-T", severity: "warning", message: "Credențialele autorului nu sunt vizibile.", recommendation: "Adăugați calificările profesionale ale autorului.", impact: "high", dimension: "eeatScore" });
  }

  // Reviewer assigned (15%)
  if (page.reviewerId && page.reviewerName) {
    totalScore += 15;
  } else {
    if (["SERVICE_HUB", "SERVICE_DETAIL", "MONEY_PAGE", "LOCALITY", "GUIDE"].includes(page.pageType)) {
      issues.push({ id: "eeat-reviewer", category: "E-E-A-T", severity: "critical", message: "Pagina YMYL nu are reviewer legal.", recommendation: "Atribuiți un avocat reviewer pentru conținut juridic.", impact: "high", dimension: "eeatScore" });
    } else {
      totalScore += 8;
    }
  }

  // Review date (15%)
  if (page.reviewedAt) {
    const reviewDate = new Date(page.reviewedAt);
    const monthsAgo = (Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsAgo < 6) {
      totalScore += 15;
    } else if (monthsAgo < 12) {
      totalScore += 10;
      issues.push({ id: "eeat-review-date", category: "E-E-A-T", severity: "info", message: `Ultima verificare: acum ${Math.round(monthsAgo)} luni.`, recommendation: "Reverificați conținutul la fiecare 6 luni.", impact: "low", dimension: "eeatScore" });
    } else {
      totalScore += 5;
      issues.push({ id: "eeat-review-stale", category: "E-E-A-T", severity: "warning", message: `Conținutul nu a fost reverificat de ${Math.round(monthsAgo)} luni.`, recommendation: "Reverificarea urgentă este necesară.", impact: "high", dimension: "eeatScore" });
    }
  } else {
    issues.push({ id: "eeat-no-review", category: "E-E-A-T", severity: "warning", message: "Data verificării lipsește.", recommendation: "Adăugați data la care conținutul a fost verificat de un avocat.", impact: "medium", dimension: "eeatScore" });
  }

  // Legal disclaimer (10%)
  if (page.legalDisclaimer) {
    totalScore += 10;
  } else {
    issues.push({ id: "eeat-disclaimer", category: "E-E-A-T", severity: "warning", message: "Disclaimerul legal lipsește.", recommendation: "Adăugați un disclaimer că informațiile nu constituie consiliere juridică.", impact: "medium", dimension: "eeatScore" });
  }

  // Contact accessible (10%)
  const hasCtaBlock = page.content.some((b) => b.type === "cta");
  if (hasCtaBlock) {
    totalScore += 10;
  } else {
    totalScore += 3;
    issues.push({ id: "eeat-contact", category: "E-E-A-T", severity: "info", message: "Bloc de contact/CTA absent.", recommendation: "Adăugați un bloc CTA cu date de contact vizibile.", impact: "medium", dimension: "eeatScore" });
  }

  // Citations (15%)
  const textContent = page.content.map((b) => b.content).join(" ");
  const hasCitations = /(?:art\.|articol|lege|cod|ordonanță|OUG|nr\.|\/\d{4})/i.test(textContent);
  if (hasCitations) {
    totalScore += 15;
  } else {
    if (["SERVICE_HUB", "SERVICE_DETAIL", "MONEY_PAGE", "GUIDE"].includes(page.pageType)) {
      totalScore += 3;
      issues.push({ id: "eeat-citations", category: "E-E-A-T", severity: "warning", message: "Lipsesc referințe la legislația relevantă.", recommendation: "Adăugați referințe la articole de lege, coduri, sau hotărâri relevante.", impact: "high", dimension: "eeatScore" });
    } else {
      totalScore += 10;
    }
  }

  return { score: Math.min(100, totalScore), issues };
}
