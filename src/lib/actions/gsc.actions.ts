"use server";

// ============================================================
// Google Search Console — Server Actions
// Authenticates via Service Account, pulls last 30 days of data
// ============================================================

import { google } from "googleapis";

// ---------- types ----------
export interface SearchPerformanceEntry {
  id: string;
  query: string;
  pageUrl: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  device?: string;
  date?: string;
}

export interface GscData {
  entries: SearchPerformanceEntry[];
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  dateRange: { start: string; end: string };
  fetchedAt: string;
}

// ---------- helpers ----------
function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "seo-bot@avocat-brasov.iam.gserviceaccount.com";
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "";

  // Priority 1: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (standard)
  // Priority 2: GSC_SERVICE_ACCOUNT_JSON (the full JSON string)
  if (!privateKey && process.env.GSC_SERVICE_ACCOUNT_JSON) {
    try {
      const sa = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
      privateKey = sa.private_key || "";
    } catch (e) {
      console.error("[GSC] Failed to parse GSC_SERVICE_ACCOUNT_JSON", e);
    }
  }

  if (!privateKey) {
    throw new Error("Missing Google Search Console credentials (private key). Please set GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY or GSC_SERVICE_ACCOUNT_JSON.");
  }

  const formattedKey = privateKey.replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: { 
      client_email: email, 
      private_key: formattedKey 
    },
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

function getSiteUrl(): string {
  return (
    process.env.GSC_SITE_URL ||
    "https://avbrasov--avocat-brasov.europe-west4.hosted.app"
  );
}

function dateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ---------- public actions ----------

/**
 * Fetch the last 30 days of Search Console data grouped by query + page.
 */
export async function fetchSearchPerformance(): Promise<GscData> {
  const auth = getAuth();
  const webmasters = google.searchconsole({ version: "v1", auth });

  const end = new Date();
  end.setDate(end.getDate() - 1); // GSC data has ~2-day lag
  const start = new Date(end);
  start.setDate(start.getDate() - 30);

  const startDate = dateString(start);
  const endDate = dateString(end);

  try {
    const res = await webmasters.searchanalytics.query({
      siteUrl: getSiteUrl(),
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query", "page"],
        rowLimit: 500,
        dataState: "all",
      },
    });

    const rows = res.data.rows || [];

    const entries: SearchPerformanceEntry[] = rows.map((row, i) => ({
      id: `gsc-${i}`,
      query: row.keys?.[0] || "",
      pageUrl: row.keys?.[1] || "",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: Math.round((row.ctr || 0) * 10000) / 100, // → percentage
      position: Math.round((row.position || 0) * 10) / 10,
    }));

    const totalClicks = entries.reduce((s, e) => s + e.clicks, 0);
    const totalImpressions = entries.reduce((s, e) => s + e.impressions, 0);
    const avgCtr =
      totalImpressions > 0
        ? Math.round((totalClicks / totalImpressions) * 10000) / 100
        : 0;
    const avgPosition =
      entries.length > 0
        ? Math.round(
            (entries.reduce((s, e) => s + e.position, 0) / entries.length) * 10
          ) / 10
        : 0;

    return {
      entries,
      totals: {
        clicks: totalClicks,
        impressions: totalImpressions,
        ctr: avgCtr,
        position: avgPosition,
      },
      dateRange: { start: startDate, end: endDate },
      fetchedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GSC] fetchSearchPerformance error:", message);
    throw new Error(`Eroare la preluarea datelor GSC: ${message}`);
  }
}

/**
 * Fetch GSC data grouped by page only (for top-pages view).
 */
export async function fetchTopPages(): Promise<GscData> {
  const auth = getAuth();
  const webmasters = google.searchconsole({ version: "v1", auth });

  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - 30);

  const startDate = dateString(start);
  const endDate = dateString(end);

  try {
    const res = await webmasters.searchanalytics.query({
      siteUrl: getSiteUrl(),
      requestBody: {
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 100,
        dataState: "all",
      },
    });

    const rows = res.data.rows || [];

    const entries: SearchPerformanceEntry[] = rows.map((row, i) => ({
      id: `gsc-page-${i}`,
      query: "",
      pageUrl: row.keys?.[0] || "",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: Math.round((row.ctr || 0) * 10000) / 100,
      position: Math.round((row.position || 0) * 10) / 10,
    }));

    const totalClicks = entries.reduce((s, e) => s + e.clicks, 0);
    const totalImpressions = entries.reduce((s, e) => s + e.impressions, 0);

    return {
      entries,
      totals: {
        clicks: totalClicks,
        impressions: totalImpressions,
        ctr:
          totalImpressions > 0
            ? Math.round((totalClicks / totalImpressions) * 10000) / 100
            : 0,
        position:
          entries.length > 0
            ? Math.round(
                (entries.reduce((s, e) => s + e.position, 0) / entries.length) *
                  10
              ) / 10
            : 0,
      },
      dateRange: { start: startDate, end: endDate },
      fetchedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GSC] fetchTopPages error:", message);
    throw new Error(`Eroare la preluarea paginilor GSC: ${message}`);
  }
}
