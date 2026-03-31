// ============================================================
// Content Quality Score Analyzer (Dimension 3)
// ============================================================

import type { AnalysisIssue } from "@/types";
import type { AnalyzerInput, DimensionResult } from "./types";

function getTextContent(content: { type: string; content: string }[]): string {
  return content
    .filter((b) => ["paragraph", "heading", "list", "faq"].includes(b.type))
    .map((b) => b.content)
    .join(" ");
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function checkWordCount(content: { type: string; content: string }[], pageType: string): { score: number; message: string; recommendation: string } {
  const text = getTextContent(content);
  const words = countWords(text);
  const minWords: Record<string, number> = {
    SERVICE_HUB: 800,
    SERVICE_DETAIL: 600,
    MONEY_PAGE: 1000,
    LOCALITY: 500,
    GUIDE: 1000,
    ATTORNEY_PROFILE: 300,
    FAQ_PAGE: 500,
    HOMEPAGE: 400,
    CONTACT: 200,
    LEGAL_PAGE: 300,
  };
  const min = minWords[pageType] || 500;
  if (words >= min * 1.5) return { score: 100, message: `Conținut complet (${words} cuvinte, minim recomandat: ${min}).`, recommendation: "" };
  if (words >= min) return { score: 80, message: `Conținut suficient (${words} cuvinte, minim: ${min}).`, recommendation: "Poate adăuga mai mult conținut util pentru a acoperi complet subiectul." };
  if (words >= min * 0.5) return { score: 50, message: `Conținut subțire (${words}/${min} cuvinte).`, recommendation: `Extindeti conținutul la cel puțin ${min} cuvinte cu informații utile.` };
  return { score: 20, message: `Conținut foarte scurt (${words}/${min} cuvinte).`, recommendation: `Pagina necesită semnificativ mai mult conținut (minim ${min} cuvinte).` };
}

function checkParagraphDensity(content: { type: string; content: string }[]): { score: number; message: string; recommendation: string } {
  const paragraphs = content.filter((b) => b.type === "paragraph");
  if (paragraphs.length === 0) return { score: 20, message: "Nu există paragrafe.", recommendation: "Adăugați paragrafe de text structurat." };
  const avgLen = paragraphs.reduce((sum, p) => sum + countWords(p.content), 0) / paragraphs.length;
  if (avgLen >= 30 && avgLen <= 80) return { score: 100, message: `Densitate optimă (medie ${Math.round(avgLen)} cuvinte/paragraf).`, recommendation: "" };
  if (avgLen > 100) return { score: 50, message: `Paragrafe prea lungi (medie ${Math.round(avgLen)} cuvinte).`, recommendation: "Împărțiți paragrafele lungi în bucăți de 40-80 cuvinte." };
  if (avgLen < 20) return { score: 60, message: `Paragrafe prea scurte (medie ${Math.round(avgLen)} cuvinte).`, recommendation: "Dezvoltați paragrafele cu mai multe detalii." };
  return { score: 80, message: `Densitate acceptabilă (${Math.round(avgLen)} cuvinte/paragraf).`, recommendation: "" };
}

function checkIntroClarity(content: { type: string; content: string }[]): { score: number; message: string; recommendation: string } {
  const firstParagraph = content.find((b) => b.type === "paragraph");
  if (!firstParagraph) return { score: 0, message: "Introducerea lipsește.", recommendation: "Începeți cu un paragraf clar care răspunde la întrebarea principală a vizitatorului." };
  const words = countWords(firstParagraph.content);
  if (words >= 30 && words <= 100) return { score: 100, message: "Introducerea este concisă și informativă.", recommendation: "" };
  if (words < 30) return { score: 50, message: `Introducerea este prea scurtă (${words} cuvinte).`, recommendation: "Extindeți introducerea la 30-100 cuvinte cu informații clare." };
  return { score: 70, message: `Introducerea este prea lungă (${words} cuvinte).`, recommendation: "Reduceți introducerea la 30-100 cuvinte." };
}

function checkFaqPresence(content: { type: string; content: string }[]): { score: number; message: string; recommendation: string } {
  const faqs = content.filter((b) => b.type === "faq");
  if (faqs.length >= 5) return { score: 100, message: `${faqs.length} FAQ-uri prezente.`, recommendation: "" };
  if (faqs.length >= 3) return { score: 80, message: `${faqs.length} FAQ-uri prezente.`, recommendation: "Adăugați mai multe FAQ-uri relevante (recomandat 5+)." };
  if (faqs.length > 0) return { score: 50, message: `Doar ${faqs.length} FAQ(-uri).`, recommendation: "Adăugați cel puțin 3-5 FAQ-uri relevante." };
  return { score: 20, message: "FAQ-urile lipsesc.", recommendation: "Adăugați 3-5 întrebări frecvente relevante." };
}

function checkTopicalCompleteness(content: { type: string; content: string }[], pageType: string): { score: number; message: string; recommendation: string } {
  const types = new Set(content.map((b) => b.type));
  const requiredSections: Record<string, string[]> = {
    SERVICE_HUB: ["paragraph", "faq", "list", "cta"],
    SERVICE_DETAIL: ["paragraph", "faq", "cta"],
    MONEY_PAGE: ["paragraph", "faq", "list", "cta", "trust"],
    LOCALITY: ["paragraph", "faq", "local"],
    GUIDE: ["paragraph", "heading", "list"],
    ATTORNEY_PROFILE: ["paragraph"],
  };
  const required = requiredSections[pageType] || ["paragraph"];
  const present = required.filter((r) => types.has(r));
  const ratio = present.length / required.length;
  if (ratio >= 0.9) return { score: 100, message: "Toate secțiunile necesare sunt prezente.", recommendation: "" };
  if (ratio >= 0.6) return { score: 70, message: `${present.length}/${required.length} secțiuni prezente.`, recommendation: `Lipsesc: ${required.filter((r) => !types.has(r)).join(", ")}.` };
  return { score: 40, message: `Doar ${present.length}/${required.length} secțiuni.`, recommendation: `Adăugați secțiunile lipsă: ${required.filter((r) => !types.has(r)).join(", ")}.` };
}

function checkReadability(content: { type: string; content: string }[]): { score: number; message: string; recommendation: string } {
  const text = getTextContent(content);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return { score: 30, message: "Nu se pot analiza propozițiile.", recommendation: "Adăugați conținut cu propoziții complete." };
  const avgWords = sentences.reduce((sum, s) => sum + countWords(s), 0) / sentences.length;
  if (avgWords >= 12 && avgWords <= 22) return { score: 100, message: `Lungime medie propoziție optimă (${Math.round(avgWords)} cuvinte).`, recommendation: "" };
  if (avgWords > 25) return { score: 50, message: `Propoziții prea lungi (medie ${Math.round(avgWords)} cuvinte).`, recommendation: "Scurtați propozițiile la 15-20 cuvinte pentru lizibilitate." };
  return { score: 70, message: `Propoziții scurte (medie ${Math.round(avgWords)} cuvinte).`, recommendation: "Variați lungimea propozițiilor pentru un ritm natural." };
}

export function analyzeContentQuality(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const checks = [
    { weight: 0.15, ...checkWordCount(page.content, page.pageType) },
    { weight: 0.10, ...checkParagraphDensity(page.content) },
    { weight: 0.15, ...checkIntroClarity(page.content) },
    { weight: 0.10, ...checkFaqPresence(page.content) },
    { weight: 0.20, ...checkTopicalCompleteness(page.content, page.pageType) },
    { weight: 0.15, ...checkReadability(page.content) },
  ];

  let totalScore = 0;
  const issues: AnalysisIssue[] = [];

  for (const check of checks) {
    totalScore += check.score * check.weight;
    if (check.score < 80) {
      issues.push({
        id: `content-${issues.length}`,
        category: "Calitate Conținut",
        severity: check.score < 40 ? "critical" : check.score < 60 ? "warning" : "info",
        message: check.message,
        recommendation: check.recommendation,
        impact: check.score < 40 ? "high" : "medium",
        dimension: "contentQualityScore",
      });
    }
  }

  return { score: Math.round(totalScore / 0.85), issues };
}
