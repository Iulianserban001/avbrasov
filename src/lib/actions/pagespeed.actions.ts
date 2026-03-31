"use server";

// ============================================================
// PageSpeed Insights — Server Actions
// Runs live Lighthouse lab audits via Google PageSpeed API v5
// ============================================================

import { google } from "googleapis";

// ---------- types ----------
export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay / INP (ms)
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint (ms)
  ttfb: number; // Time To First Byte (ms)
  si: number; // Speed Index (ms)
}

export interface LighthouseAuditItem {
  id: string;
  title: string;
  score: number | null;
  displayValue?: string;
  description?: string;
}

export interface PageSpeedResult {
  url: string;
  strategy: "mobile" | "desktop";
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: CoreWebVitals;
  audits: LighthouseAuditItem[];
  fetchedAt: string;
}

// ---------- helpers ----------
function getApiKey(): string | undefined {
  return process.env.PAGESPEED_API_KEY || undefined;
}

function extractMs(audit: Record<string, unknown> | undefined): number {
  if (!audit) return 0;
  const val = audit.numericValue as number | undefined;
  return val ? Math.round(val) : 0;
}

function extractScore(
  categories: Record<string, unknown> | undefined,
  key: string
): number {
  if (!categories) return 0;
  const cat = categories[key] as { score?: number } | undefined;
  return cat?.score != null ? Math.round(cat.score * 100) : 0;
}

// ---------- public actions ----------

/**
 * Run a live PageSpeed Insights audit for a given URL & strategy.
 */
export async function fetchPageSpeedAudit(
  url: string,
  strategy: "mobile" | "desktop" = "mobile"
): Promise<PageSpeedResult> {
  const apiKey = getApiKey();
  const pagespeed = google.pagespeedonline({ version: "v5" });

  try {
    const res = await pagespeed.pagespeedapi.runpagespeed({
      url,
      strategy: strategy.toUpperCase() as "MOBILE" | "DESKTOP",
      category: ["PERFORMANCE", "ACCESSIBILITY", "BEST_PRACTICES", "SEO"],
      key: apiKey,
    });

    const lr = res.data.lighthouseResult;
    if (!lr) {
      throw new Error("Nu s-a primit răspuns Lighthouse");
    }

    const audits = lr.audits as Record<
      string,
      Record<string, unknown>
    > | undefined;
    const categories = lr.categories as
      | Record<string, { score?: number }>
      | undefined;

    // Core Web Vitals
    const coreWebVitals: CoreWebVitals = {
      lcp: extractMs(audits?.["largest-contentful-paint"]),
      fid: extractMs(audits?.["max-potential-fid"]) || extractMs(audits?.["interaction-to-next-paint"]),
      cls: audits?.["cumulative-layout-shift"]
        ? Math.round(
            ((audits["cumulative-layout-shift"].numericValue as number) || 0) *
              1000
          ) / 1000
        : 0,
      fcp: extractMs(audits?.["first-contentful-paint"]),
      ttfb: extractMs(audits?.["server-response-time"]),
      si: extractMs(audits?.["speed-index"]),
    };

    // Lighthouse category scores
    const scores = {
      performance: extractScore(
        categories as Record<string, unknown>,
        "performance"
      ),
      accessibility: extractScore(
        categories as Record<string, unknown>,
        "accessibility"
      ),
      bestPractices: extractScore(
        categories as Record<string, unknown>,
        "best-practices"
      ),
      seo: extractScore(categories as Record<string, unknown>, "seo"),
    };

    // Pick key audit items (failures + warnings)
    const auditKeys = [
      "largest-contentful-paint",
      "first-contentful-paint",
      "cumulative-layout-shift",
      "speed-index",
      "total-blocking-time",
      "interactive",
      "server-response-time",
      "render-blocking-resources",
      "uses-responsive-images",
      "uses-optimized-images",
      "uses-text-compression",
      "unused-css-rules",
      "unused-javascript",
      "modern-image-formats",
      "dom-size",
      "redirects",
      "uses-long-cache-ttl",
      "font-display",
    ];

    const auditItems: LighthouseAuditItem[] = [];
    for (const key of auditKeys) {
      const a = audits?.[key];
      if (!a) continue;
      auditItems.push({
        id: key,
        title: (a.title as string) || key,
        score: a.score != null ? (a.score as number) : null,
        displayValue: (a.displayValue as string) || undefined,
        description: (a.description as string)?.slice(0, 200) || undefined,
      });
    }

    return {
      url,
      strategy,
      scores,
      coreWebVitals,
      audits: auditItems,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[PageSpeed] fetchPageSpeedAudit error:", message);
    throw new Error(`Eroare audit PageSpeed pentru ${url}: ${message}`);
  }
}

/**
 * Run PageSpeed audits for multiple URLs (batch).
 * Runs them sequentially to avoid rate limits.
 */
export async function fetchPageSpeedBatch(
  urls: string[],
  strategy: "mobile" | "desktop" = "mobile"
): Promise<{ results: PageSpeedResult[]; errors: string[] }> {
  const results: PageSpeedResult[] = [];
  const errors: string[] = [];

  for (const url of urls) {
    try {
      const result = await fetchPageSpeedAudit(url, strategy);
      results.push(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${url}: ${message}`);
    }
  }

  return { results, errors };
}
