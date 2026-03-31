// ============================================================
// Local Relevance, AI Readiness, Conversion, Linking, Freshness, Risk
// (Dimensions 5-10)
// ============================================================

import type { AnalysisIssue } from "@/types";
import type { AnalyzerInput, DimensionResult } from "./types";

// === DIMENSION 5: Local Relevance ===
export function analyzeLocalRelevance(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const issues: AnalysisIssue[] = [];
  let totalScore = 0;
  const text = page.content.map((b) => b.content).join(" ").toLowerCase();

  if (page.pageType !== "LOCALITY" && !page.localityId) {
    return { score: 100, issues: [] };
  }

  const localityName = (page.localityName || "").toLowerCase();

  // Locality mentioned (20%)
  if (localityName && text.includes(localityName)) {
    const mentions = (text.match(new RegExp(localityName, "gi")) || []).length;
    totalScore += mentions >= 3 ? 20 : mentions >= 1 ? 12 : 0;
    if (mentions < 3) issues.push({ id: "local-mentions", category: "Relevanta Locala", severity: "info", message: `Localitatea mentionata doar de ${mentions} ori.`, recommendation: "Mentionati natural localitatea de 3-5 ori.", impact: "medium", dimension: "localRelevanceScore" });
  } else {
    issues.push({ id: "local-missing", category: "Relevanta Locala", severity: "critical", message: "Numele localitatii nu apare in continut.", recommendation: "Integrati natural referinte la localitate.", impact: "high", dimension: "localRelevanceScore" });
  }

  // Local court/institution references (20%)
  const localTerms = ["judecatoria", "tribunalul", "baroul", "notariat", "primaria", "instanta"];
  const hasLocal = localTerms.some((t) => text.includes(t));
  if (hasLocal) { totalScore += 20; }
  else { totalScore += 5; issues.push({ id: "local-inst", category: "Relevanta Locala", severity: "warning", message: "Lipsesc referinte la institutii locale.", recommendation: "Adaugati referinte la judecatoria, tribunalul sau baroul local.", impact: "high", dimension: "localRelevanceScore" }); }

  // Local FAQ content (15%)
  const localFaqs = page.content.filter((b) => b.type === "faq" && b.content.toLowerCase().includes(localityName || "brasov"));
  if (localFaqs.length >= 2) { totalScore += 15; }
  else if (localFaqs.length >= 1) { totalScore += 8; issues.push({ id: "local-faq", category: "Relevanta Locala", severity: "info", message: "Putine FAQ-uri locale.", recommendation: "Adaugati FAQ-uri specifice localitatii.", impact: "medium", dimension: "localRelevanceScore" }); }
  else { issues.push({ id: "local-faq-miss", category: "Relevanta Locala", severity: "warning", message: "Nu exista FAQ-uri cu referinte locale.", recommendation: "Creati FAQ-uri care mentioneaza specificul local.", impact: "medium", dimension: "localRelevanceScore" }); }

  // Unique local content vs template (25%)
  if (page.pageType === "LOCALITY") {
    const similarPages = input.allPages.filter((p) => p.pageType === "LOCALITY" && p.id !== page.id && p.serviceId === page.serviceId);
    if (similarPages.length === 0) { totalScore += 25; }
    else {
      const pageWords = new Set(text.split(/\s+/).filter((w) => w.length > 4));
      let maxSimilarity = 0;
      for (const sp of similarPages) {
        const spText = sp.content.map((b) => b.content).join(" ").toLowerCase();
        const spWords = new Set(spText.split(/\s+/).filter((w) => w.length > 4));
        const intersection = [...pageWords].filter((w) => spWords.has(w)).length;
        const union = new Set([...pageWords, ...spWords]).size;
        const sim = union > 0 ? intersection / union : 0;
        maxSimilarity = Math.max(maxSimilarity, sim);
      }
      if (maxSimilarity < 0.4) { totalScore += 25; }
      else if (maxSimilarity < 0.6) { totalScore += 15; issues.push({ id: "local-sim", category: "Relevanta Locala", severity: "warning", message: `Similaritate ${Math.round(maxSimilarity * 100)}% cu alte pagini de localitate.`, recommendation: "Adaugati mai mult continut unic specific acestei localitati.", impact: "high", dimension: "localRelevanceScore" }); }
      else { totalScore += 5; issues.push({ id: "local-dup", category: "Relevanta Locala", severity: "critical", message: `Similaritate foarte mare (${Math.round(maxSimilarity * 100)}%) - risc de continut duplicat.`, recommendation: "Rescrieti semnificativ continutul sau nu publicati aceasta pagina.", impact: "high", dimension: "localRelevanceScore" }); }
    }
  } else { totalScore += 20; }

  // Local contact (10%)
  const hasLocalBlock = page.content.some((b) => b.type === "local");
  if (hasLocalBlock) { totalScore += 10; }
  else { totalScore += 3; issues.push({ id: "local-contact", category: "Relevanta Locala", severity: "info", message: "Bloc de relevanta locala absent.", recommendation: "Adaugati informatii locale: adresa, judecatorie, program.", impact: "low", dimension: "localRelevanceScore" }); }

  // Geographic schema (10%)
  if (page.schemaData && (page.schemaData as Record<string, unknown>).areaServed) { totalScore += 10; }
  else { totalScore += 3; issues.push({ id: "local-schema", category: "Relevanta Locala", severity: "info", message: "Schema geografic lipseste.", recommendation: "Adaugati areaServed in schema.org.", impact: "low", dimension: "localRelevanceScore" }); }

  return { score: Math.min(100, totalScore), issues };
}

// === DIMENSION 6: AI Search Readiness ===
export function analyzeAiReadiness(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const issues: AnalysisIssue[] = [];
  let totalScore = 0;
  const text = page.content.map((b) => b.content).join(" ");

  // Answer-first content (20%)
  const firstPara = page.content.find((b) => b.type === "paragraph");
  if (firstPara && firstPara.content.length >= 100) {
    totalScore += 20;
  } else {
    totalScore += 5;
    issues.push({ id: "ai-answer", category: "AI Readiness", severity: "warning", message: "Primul paragraf nu ofera un raspuns direct.", recommendation: "Incepeti cu un raspuns clar la intrebarea principala.", impact: "high", dimension: "aiSearchReadiness" });
  }

  // Definitional blocks (15%)
  const hasDefinitions = /(?:este|reprezinta|inseamna|se refera la)/i.test(text);
  if (hasDefinitions) { totalScore += 15; }
  else { totalScore += 5; issues.push({ id: "ai-def", category: "AI Readiness", severity: "info", message: "Lipsesc blocuri definitionale.", recommendation: "Adaugati definitii clare ale termenilor juridici.", impact: "medium", dimension: "aiSearchReadiness" }); }

  // FAQ structure (15%)
  const faqBlocks = page.content.filter((b) => b.type === "faq");
  if (faqBlocks.length >= 3) { totalScore += 15; }
  else if (faqBlocks.length > 0) { totalScore += 8; }
  else { issues.push({ id: "ai-faq", category: "AI Readiness", severity: "warning", message: "FAQ-uri lipsesc.", recommendation: "Adaugati FAQ-uri extraibile de motoarele AI.", impact: "medium", dimension: "aiSearchReadiness" }); }

  // Extractable key points (15%)
  const listBlocks = page.content.filter((b) => b.type === "list");
  if (listBlocks.length >= 2) { totalScore += 15; }
  else if (listBlocks.length >= 1) { totalScore += 8; }
  else { totalScore += 3; issues.push({ id: "ai-lists", category: "AI Readiness", severity: "info", message: "Lipsesc liste cu puncte cheie.", recommendation: "Adaugati liste cu pasii procesului, documente necesare etc.", impact: "medium", dimension: "aiSearchReadiness" }); }

  // Entity clarity (15%)
  if (page.authorName && page.h1) { totalScore += 15; }
  else { totalScore += 5; issues.push({ id: "ai-entity", category: "AI Readiness", severity: "info", message: "Claritatea entitatilor este scazuta.", recommendation: "Asigurati claritate maxima: cine scrie, ce serviciu, unde.", impact: "medium", dimension: "aiSearchReadiness" }); }

  // Up-to-date timestamps (10%)
  if (page.updatedContentAt || page.publishedAt) { totalScore += 10; }
  else { issues.push({ id: "ai-date", category: "AI Readiness", severity: "warning", message: "Lipsesc date de publicare/actualizare.", recommendation: "Afisati data publicarii si ultima actualizare.", impact: "medium", dimension: "aiSearchReadiness" }); }

  // No fluff (10%)
  const words = text.split(/\s+/).length;
  const uniqueWords = new Set(text.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  const ratio = uniqueWords.size / Math.max(words, 1);
  if (ratio > 0.3) { totalScore += 10; }
  else { totalScore += 4; issues.push({ id: "ai-fluff", category: "AI Readiness", severity: "info", message: "Continut potential repetitiv.", recommendation: "Reduceti repetitiile si continutul lipsit de substanta.", impact: "low", dimension: "aiSearchReadiness" }); }

  return { score: Math.min(100, totalScore), issues };
}

// === DIMENSION 7: Conversion Clarity ===
export function analyzeConversionClarity(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const issues: AnalysisIssue[] = [];
  let totalScore = 0;
  const text = page.content.map((b) => b.content).join(" ").toLowerCase();

  // Clear CTA (25%)
  const ctaBlock = page.content.find((b) => b.type === "cta");
  if (ctaBlock) { totalScore += 25; }
  else { issues.push({ id: "conv-cta", category: "Conversie", severity: "critical", message: "Bloc CTA absent.", recommendation: "Adaugati un CTA clar: telefon, formular, programare.", impact: "high", dimension: "conversionClarityScore" }); }

  // Phone visible (15%)
  const hasPhone = /(?:07\d{8}|0\d{9}|\+40)/i.test(text);
  if (hasPhone) { totalScore += 15; }
  else { totalScore += 3; issues.push({ id: "conv-phone", category: "Conversie", severity: "warning", message: "Numarul de telefon nu apare in continut.", recommendation: "Adaugati numarul de telefon vizibil pe pagina.", impact: "medium", dimension: "conversionClarityScore" }); }

  // Process steps (20%)
  const processBlock = page.content.find((b) => b.type === "process");
  if (processBlock) { totalScore += 20; }
  else if (page.content.some((b) => b.type === "list")) { totalScore += 10; }
  else { issues.push({ id: "conv-process", category: "Conversie", severity: "warning", message: "Sectiunea de pasi/proces lipseste.", recommendation: "Descrieti pasii urmatori: cum functioneaza colaborarea.", impact: "medium", dimension: "conversionClarityScore" }); }

  // Trust (15%)
  const trustBlock = page.content.find((b) => b.type === "trust");
  if (trustBlock || page.authorName) { totalScore += 15; }
  else { totalScore += 3; issues.push({ id: "conv-trust", category: "Conversie", severity: "warning", message: "Semnale de incredere slabe.", recommendation: "Adaugati bloc cu credibilitatea avocatului.", impact: "medium", dimension: "conversionClarityScore" }); }

  // Eligibility (15%)
  const eligBlock = page.content.find((b) => b.type === "eligibility");
  if (eligBlock) { totalScore += 15; }
  else { totalScore += 5; issues.push({ id: "conv-elig", category: "Conversie", severity: "info", message: "Sectiunea de eligibilitate lipseste.", recommendation: "Clarificati cine beneficiaza de acest serviciu.", impact: "medium", dimension: "conversionClarityScore" }); }

  // No friction (10%)
  totalScore += 10;

  return { score: Math.min(100, totalScore), issues };
}

// === DIMENSION 8: Internal Linking ===
export function analyzeInternalLinking(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const issues: AnalysisIssue[] = [];
  let totalScore = 0;

  const outbound = input.internalLinks.filter((l) => l.sourcePageId === page.id);
  const inbound = input.internalLinks.filter((l) => l.targetPageId === page.id);

  // Outbound (25%)
  if (outbound.length >= 5) { totalScore += 25; }
  else if (outbound.length >= 3) { totalScore += 15; issues.push({ id: "link-out", category: "Linking Intern", severity: "info", message: `${outbound.length} linkuri de iesire (recomandat 5+).`, recommendation: "Adaugati mai multe linkuri interne relevante.", impact: "low", dimension: "internalLinkingScore" }); }
  else { totalScore += 5; issues.push({ id: "link-out-low", category: "Linking Intern", severity: "warning", message: `Doar ${outbound.length} linkuri de iesire.`, recommendation: "Fiecare pagina ar trebui sa aiba minim 3-5 linkuri interne.", impact: "medium", dimension: "internalLinkingScore" }); }

  // Inbound (25%)
  if (inbound.length >= 3) { totalScore += 25; }
  else if (inbound.length >= 1) { totalScore += 12; issues.push({ id: "link-in", category: "Linking Intern", severity: "info", message: `${inbound.length} linkuri de intrare.`, recommendation: "Linkati catre aceasta pagina din alte pagini relevante.", impact: "medium", dimension: "internalLinkingScore" }); }
  else { issues.push({ id: "link-orphan", category: "Linking Intern", severity: "critical", message: "Pagina orfana - niciun link de intrare.", recommendation: "Adaugati linkuri catre aceasta pagina din alte sectiuni.", impact: "high", dimension: "internalLinkingScore" }); }

  // Anchor text quality (20%)
  const genericAnchors = ["aici", "click", "click aici", "mai mult", "link", "pagina"];
  const badAnchors = outbound.filter((l) => genericAnchors.includes(l.anchorText.toLowerCase()));
  if (badAnchors.length === 0 && outbound.length > 0) { totalScore += 20; }
  else if (badAnchors.length > 0) { totalScore += 8; issues.push({ id: "link-anchor", category: "Linking Intern", severity: "warning", message: `${badAnchors.length} linkuri cu ancora generica.`, recommendation: "Folositi text descriptiv pentru ancorele linkurilor.", impact: "medium", dimension: "internalLinkingScore" }); }
  else { totalScore += 10; }

  // Topical cluster (15%)
  const sameServiceLinks = outbound.filter((l) => {
    const target = input.allPages.find((p) => p.id === l.targetPageId);
    return target && target.serviceId === page.serviceId;
  });
  if (sameServiceLinks.length >= 2 || page.pageType === "HOMEPAGE") { totalScore += 15; }
  else { totalScore += 5; issues.push({ id: "link-cluster", category: "Linking Intern", severity: "info", message: "Conectivitate slaba cu clusterul tematic.", recommendation: "Linkati catre alte pagini din acelasi serviciu juridic.", impact: "medium", dimension: "internalLinkingScore" }); }

  // Breadcrumbs (15%)
  if (page.breadcrumbs && page.breadcrumbs.length > 1) { totalScore += 15; }
  else { totalScore += 5; issues.push({ id: "link-breadcrumb", category: "Linking Intern", severity: "info", message: "Breadcrumb-urile lipsesc sau sunt incomplete.", recommendation: "Implementati breadcrumb-uri complete.", impact: "low", dimension: "internalLinkingScore" }); }

  return { score: Math.min(100, totalScore), issues };
}

// === DIMENSION 9: Freshness ===
export function analyzeFreshness(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const issues: AnalysisIssue[] = [];
  let totalScore = 0;
  const now = Date.now();

  // Published date (15%)
  if (page.publishedAt) { totalScore += 15; }
  else { issues.push({ id: "fresh-pub", category: "Prospetime", severity: "warning", message: "Data publicarii lipseste.", recommendation: "Setati data publicarii.", impact: "medium", dimension: "freshnessScore" }); }

  // Updated date & recency (25%)
  if (page.updatedContentAt) {
    const months = (now - new Date(page.updatedContentAt).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (months < 3) { totalScore += 25; }
    else if (months < 6) { totalScore += 18; }
    else if (months < 12) { totalScore += 10; issues.push({ id: "fresh-update", category: "Prospetime", severity: "info", message: `Ultima actualizare acum ${Math.round(months)} luni.`, recommendation: "Actualizati continutul cel putin la 6 luni.", impact: "medium", dimension: "freshnessScore" }); }
    else { totalScore += 5; issues.push({ id: "fresh-stale", category: "Prospetime", severity: "warning", message: `Continut vechi - neactualizat de ${Math.round(months)} luni.`, recommendation: "Actualizare urgenta necesara.", impact: "high", dimension: "freshnessScore" }); }
  } else { issues.push({ id: "fresh-no-update", category: "Prospetime", severity: "warning", message: "Data ultimei actualizari lipseste.", recommendation: "Adaugati si afisati data ultimei actualizari.", impact: "medium", dimension: "freshnessScore" }); }

  // Review date (20%)
  if (page.nextReviewDate) {
    const reviewDate = new Date(page.nextReviewDate);
    if (reviewDate.getTime() > now) { totalScore += 20; }
    else { totalScore += 5; issues.push({ id: "fresh-review-due", category: "Prospetime", severity: "warning", message: "Data de reverificare a trecut.", recommendation: "Planificati reverificarea continutului.", impact: "medium", dimension: "freshnessScore" }); }
  } else { totalScore += 8; issues.push({ id: "fresh-no-review", category: "Prospetime", severity: "info", message: "Nicio data de reverificare planificata.", recommendation: "Setati o data de reverificare.", impact: "low", dimension: "freshnessScore" }); }

  // Current references (20%)
  const text = page.content.map((b) => b.content).join(" ");
  const yearRefs = text.match(/20\d{2}/g) || [];
  const currentYear = new Date().getFullYear();
  const hasCurrentYear = yearRefs.some((y) => parseInt(y) >= currentYear - 1);
  if (hasCurrentYear) { totalScore += 20; }
  else { totalScore += 8; issues.push({ id: "fresh-refs", category: "Prospetime", severity: "info", message: "Nu exista referinte la anul curent.", recommendation: "Actualizati referintele la legislatia curenta.", impact: "low", dimension: "freshnessScore" }); }

  // Stale CTAs (20%)
  totalScore += 20;

  return { score: Math.min(100, totalScore), issues };
}

// === DIMENSION 10: Risk Score (0 = best, 100 = worst) ===
export function analyzeRisk(input: AnalyzerInput): DimensionResult {
  const { page } = input;
  const issues: AnalysisIssue[] = [];
  let riskScore = 0;
  const text = page.content.map((b) => b.content).join(" ");
  const words = text.split(/\s+/).length;

  // Near-duplicate detection (25%)
  if (page.pageType === "LOCALITY") {
    const similar = input.allPages.filter((p) => p.pageType === "LOCALITY" && p.id !== page.id && p.serviceId === page.serviceId);
    for (const sp of similar) {
      const spText = sp.content.map((b) => b.content).join(" ");
      const pageWords = new Set(text.toLowerCase().split(/\s+/).filter((w) => w.length > 4));
      const spWords = new Set(spText.toLowerCase().split(/\s+/).filter((w) => w.length > 4));
      const intersection = [...pageWords].filter((w) => spWords.has(w)).length;
      const union = new Set([...pageWords, ...spWords]).size;
      const sim = union > 0 ? intersection / union : 0;
      if (sim > 0.7) {
        riskScore += 25;
        issues.push({ id: "risk-dup", category: "Risc", severity: "critical", message: `Continut near-duplicate (${Math.round(sim * 100)}% similar cu ${sp.title}).`, recommendation: "Rescrieti semnificativ sau nu publicati.", impact: "high", dimension: "riskScore" });
        break;
      } else if (sim > 0.5) {
        riskScore += 12;
        issues.push({ id: "risk-sim", category: "Risc", severity: "warning", message: `Similaritate ridicata (${Math.round(sim * 100)}%) cu ${sp.title}.`, recommendation: "Diferentiati continutul.", impact: "medium", dimension: "riskScore" });
        break;
      }
    }
  }

  // Thin content (20%)
  if (words < 200) {
    riskScore += 20;
    issues.push({ id: "risk-thin", category: "Risc", severity: "critical", message: `Continut subtire (${words} cuvinte).`, recommendation: "Extindeti semnificativ continutul.", impact: "high", dimension: "riskScore" });
  } else if (words < 400) {
    riskScore += 8;
    issues.push({ id: "risk-short", category: "Risc", severity: "warning", message: `Continut scurt (${words} cuvinte).`, recommendation: "Adaugati mai mult continut util.", impact: "medium", dimension: "riskScore" });
  }

  // Doorway pattern (20%)
  if (page.pageType === "LOCALITY" && words < 300 && !page.localityId) {
    riskScore += 20;
    issues.push({ id: "risk-doorway", category: "Risc", severity: "critical", message: "Posibil doorway page - continut scurt fara date locale reale.", recommendation: "Adaugati continut unic si specific localitatii.", impact: "high", dimension: "riskScore" });
  }

  // Keyword stuffing (15%)
  if (page.targetKeyword) {
    const kw = page.targetKeyword.toLowerCase();
    const kwCount = (text.toLowerCase().match(new RegExp(kw, "g")) || []).length;
    const density = kwCount / Math.max(words, 1);
    if (density > 0.03) {
      riskScore += 15;
      issues.push({ id: "risk-stuff", category: "Risc", severity: "warning", message: `Densitate cuvant cheie ridicata (${(density * 100).toFixed(1)}%).`, recommendation: "Reduceti frecventa cuvantului cheie.", impact: "medium", dimension: "riskScore" });
    }
  }

  // Missing trust signals (10%)
  if (!page.authorId && !page.legalDisclaimer) {
    riskScore += 10;
    issues.push({ id: "risk-trust", category: "Risc", severity: "warning", message: "Semnale de incredere complet absente.", recommendation: "Adaugati autor, disclaimer, date de contact.", impact: "medium", dimension: "riskScore" });
  }

  return { score: Math.min(100, riskScore), issues };
}
