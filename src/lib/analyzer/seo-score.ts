// ============================================================
// SEO Score Analyzer (Dimension 1)
// ============================================================

import type { AnalysisIssue } from "@/types";
import type { AnalyzerInput, DimensionResult, CheckResult } from "./types";

function checkTitleLength(title: string): CheckResult {
  const len = title.length;
  if (len >= 50 && len <= 60) {
    return { passed: true, score: 100, message: `Lungimea titlului este optimă (${len} caractere).`, recommendation: "", severity: "success", impact: "high" };
  }
  if (len >= 40 && len <= 70) {
    return { passed: true, score: 70, message: `Titlul are ${len} caractere. Optim: 50-60.`, recommendation: "Ajustați lungimea titlului la 50-60 de caractere pentru afișare completă în SERP.", severity: "warning", impact: "medium" };
  }
  if (len < 20) {
    return { passed: false, score: 20, message: `Titlul este prea scurt (${len} caractere).`, recommendation: "Adăugați mai multe cuvinte relevante. Titlul trebuie să aibă minim 40 de caractere.", severity: "critical", impact: "high" };
  }
  return { passed: false, score: 40, message: `Titlul are ${len} caractere, departe de optim (50-60).`, recommendation: len > 70 ? "Scurtați titlul pentru a nu fi trunchiat în rezultatele de căutare." : "Extindeți titlul cu cuvinte cheie relevante.", severity: "warning", impact: "high" };
}

function checkTitleKeyword(title: string, targetKeyword?: string): CheckResult {
  if (!targetKeyword) {
    return { passed: false, score: 30, message: "Nu a fost definit un cuvânt cheie țintă.", recommendation: "Definiți un cuvânt cheie țintă pentru această pagină.", severity: "warning", impact: "high" };
  }
  const lowerTitle = title.toLowerCase();
  const lowerKeyword = targetKeyword.toLowerCase();
  if (lowerTitle.includes(lowerKeyword)) {
    const pos = lowerTitle.indexOf(lowerKeyword);
    if (pos < lowerTitle.length / 3) {
      return { passed: true, score: 100, message: `Cuvântul cheie „${targetKeyword}" apare la începutul titlului.`, recommendation: "", severity: "success", impact: "high" };
    }
    return { passed: true, score: 80, message: `Cuvântul cheie „${targetKeyword}" apare în titlu.`, recommendation: "Mutați cuvântul cheie mai aproape de începutul titlului pentru impact maxim.", severity: "info", impact: "medium" };
  }
  return { passed: false, score: 20, message: `Cuvântul cheie „${targetKeyword}" nu apare în titlu.`, recommendation: "Includeți cuvântul cheie țintă în titlul paginii.", severity: "critical", impact: "high" };
}

function checkMetaDescription(meta?: string): CheckResult {
  if (!meta || meta.trim().length === 0) {
    return { passed: false, score: 0, message: "Meta descrierea lipsește.", recommendation: "Scrieți o meta descriere unică de 120-160 caractere care include cuvântul cheie.", severity: "critical", impact: "high" };
  }
  const len = meta.trim().length;
  if (len >= 120 && len <= 160) {
    return { passed: true, score: 100, message: `Meta descrierea are lungime optimă (${len} caractere).`, recommendation: "", severity: "success", impact: "high" };
  }
  if (len >= 80 && len < 120) {
    return { passed: true, score: 60, message: `Meta descrierea este scurtă (${len} caractere).`, recommendation: "Extindeți meta descrierea la 120-160 caractere.", severity: "warning", impact: "medium" };
  }
  if (len > 160) {
    return { passed: true, score: 70, message: `Meta descrierea este prea lungă (${len} caractere).`, recommendation: "Reduceți meta descrierea sub 160 caractere pentru a nu fi trunchiată.", severity: "warning", impact: "medium" };
  }
  return { passed: false, score: 30, message: `Meta descrierea este foarte scurtă (${len} caractere).`, recommendation: "Scrieți o meta descriere descriptivă de minim 120 caractere.", severity: "critical", impact: "high" };
}

function checkUrlStructure(slug: string): CheckResult {
  const parts = slug.split("/").filter(Boolean);
  const lastSegment = parts[parts.length - 1] || "";
  if (lastSegment.length <= 50 && !lastSegment.includes("_") && /^[a-z0-9-]+$/.test(lastSegment)) {
    return { passed: true, score: 100, message: "Structura URL-ului este curată și optimizată.", recommendation: "", severity: "success", impact: "medium" };
  }
  const issues: string[] = [];
  if (lastSegment.length > 50) issues.push("URL prea lung");
  if (lastSegment.includes("_")) issues.push("Folosiți cratime în loc de underscore");
  if (!/^[a-z0-9-/]+$/.test(slug)) issues.push("URL-ul conține caractere nevalide");
  return { passed: false, score: 50, message: `Probleme URL: ${issues.join(", ")}.`, recommendation: "Restructurați URL-ul: scurt, cu cratime, fără caractere speciale.", severity: "warning", impact: "medium" };
}

function checkH1(h1: string, targetKeyword?: string): CheckResult {
  if (!h1 || h1.trim().length === 0) {
    return { passed: false, score: 0, message: "Tagul H1 lipsește.", recommendation: "Adăugați un H1 unic și descriptiv care include cuvântul cheie.", severity: "critical", impact: "high" };
  }
  let score = 70;
  if (targetKeyword && h1.toLowerCase().includes(targetKeyword.toLowerCase())) {
    score = 100;
    return { passed: true, score, message: "H1 conține cuvântul cheie țintă.", recommendation: "", severity: "success", impact: "high" };
  }
  return { passed: true, score, message: "H1 este prezent dar nu conține cuvântul cheie.", recommendation: "Includeți cuvântul cheie țintă în H1.", severity: "info", impact: "medium" };
}

function checkHeadingHierarchy(headings: { level: number; text: string }[]): CheckResult {
  if (!headings || headings.length === 0) {
    return { passed: false, score: 30, message: "Ierarhia de heading-uri este goală.", recommendation: "Adăugați structură cu H2 și H3 pentru organizarea conținutului.", severity: "warning", impact: "medium" };
  }
  let valid = true;
  let prevLevel = 1;
  for (const h of headings) {
    if (h.level > prevLevel + 1) {
      valid = false;
      break;
    }
    prevLevel = h.level;
  }
  if (valid && headings.length >= 3) {
    return { passed: true, score: 100, message: `Ierarhie de heading-uri corectă (${headings.length} heading-uri).`, recommendation: "", severity: "success", impact: "medium" };
  }
  if (!valid) {
    return { passed: false, score: 40, message: "Ierarhia de heading-uri are salturi (ex: H1 → H3 fără H2).", recommendation: "Corectați ierarhia: folosiți H2 înainte de H3 etc.", severity: "warning", impact: "medium" };
  }
  return { passed: true, score: 70, message: `Doar ${headings.length} heading-uri, adăugați mai multe.`, recommendation: "Adăugați mai multe subheading-uri H2/H3 pentru structură.", severity: "info", impact: "low" };
}

function checkCanonical(canonicalUrl: string | undefined, slug: string): CheckResult {
  if (!canonicalUrl) {
    return { passed: true, score: 80, message: "Canonical implicit (self-referencing).", recommendation: "Setați canonical URL-ul explicit.", severity: "info", impact: "low" };
  }
  if (canonicalUrl.includes(slug)) {
    return { passed: true, score: 100, message: "Canonical URL-ul este corect (self-referencing).", recommendation: "", severity: "success", impact: "medium" };
  }
  return { passed: true, score: 60, message: "Canonical URL diferă de URL-ul paginii.", recommendation: "Verificați că canonical URL-ul este intenționat diferit.", severity: "warning", impact: "medium" };
}

export function analyzeSeoScore(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const checks = [
    { weight: 0.15, result: checkTitleLength(page.title) },
    { weight: 0.15, result: checkTitleKeyword(page.title, page.targetKeyword) },
    { weight: 0.15, result: checkMetaDescription(page.metaDescription) },
    { weight: 0.10, result: checkUrlStructure(page.slug) },
    { weight: 0.15, result: checkH1(page.h1, page.targetKeyword) },
    { weight: 0.10, result: checkHeadingHierarchy(page.headings) },
    { weight: 0.10, result: checkCanonical(page.canonicalUrl, page.slug) },
  ];

  let totalScore = 0;
  const issues: AnalysisIssue[] = [];

  for (const check of checks) {
    totalScore += check.result.score * check.weight;
    if (!check.result.passed || check.result.severity !== "success") {
      issues.push({
        id: `seo-${issues.length}`,
        category: "SEO",
        severity: check.result.severity === "success" ? "info" : check.result.severity,
        message: check.result.message,
        recommendation: check.result.recommendation,
        impact: check.result.impact,
        dimension: "seoScore",
      });
    }
  }

  return { score: Math.round(totalScore / 0.9), issues }; // Normalize since weights sum to 0.9
}
