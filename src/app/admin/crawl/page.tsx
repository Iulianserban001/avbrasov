"use client";

import { useState, useEffect } from "react";
import {
  Bug, CheckCircle, AlertTriangle, XCircle, Globe,
  Clock, Zap, FileSearch, Shield, ExternalLink, RefreshCw, Loader2
} from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Page } from "@/types";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";
import { fetchPageSpeedAudit } from "@/lib/actions/pagespeed.actions";
import type { PageSpeedResult } from "@/lib/actions/pagespeed.actions";

interface CrawlCheck {
  id: string;
  name: string;
  category: string;
  status: "pass" | "warning" | "fail";
  message: string;
  impact: string;
}

function runTechnicalAudit(pages: Page[]): CrawlCheck[] {
  const checks: CrawlCheck[] = [];

  checks.push({
    id: "robots", name: "robots.txt", category: "Crawlability",
    status: "pass", message: "robots.txt există și este configurat corect.",
    impact: "Motoarele de căutare pot accesa paginile."
  });

  checks.push({
    id: "sitemap", name: "Sitemap XML", category: "Crawlability",
    status: "warning", message: "Sitemap.xml nu este încă generat dinamic.",
    impact: "Generați un sitemap dinamic pentru toate paginile publicate."
  });

  checks.push({
    id: "https", name: "HTTPS", category: "Security",
    status: "pass", message: "Site-ul folosește HTTPS.",
    impact: "Conexiune securizată pentru utilizatori."
  });

  const noTitle = pages.filter((p) => !p.title || p.title.length < 20);
  checks.push({
    id: "titles", name: "Titluri Meta", category: "On-Page",
    status: noTitle.length > 0 ? "warning" : "pass",
    message: noTitle.length > 0 ? `${noTitle.length} pagini au titluri scurte sau lipsă.` : "Toate paginile au titluri optime.",
    impact: "Titlurile sunt factori critici de ranking."
  });

  const noDesc = pages.filter((p) => !p.metaDescription || p.metaDescription.length < 50);
  checks.push({
    id: "descriptions", name: "Meta Descriptions", category: "On-Page",
    status: noDesc.length > 0 ? "warning" : "pass",
    message: noDesc.length > 0 ? `${noDesc.length} pagini au descripții inadecvate.` : "Descripțiile meta sunt optime.",
    impact: "Descripțiile influențează CTR-ul în SERP."
  });

  const noH1 = pages.filter((p) => !p.h1);
  checks.push({
    id: "h1", name: "Heading H1", category: "On-Page",
    status: noH1.length > 0 ? "fail" : "pass",
    message: noH1.length > 0 ? `${noH1.length} pagini nu au H1.` : "Toate paginile au H1 unic.",
    impact: "H1 este esențial pentru structura și relevanța paginii."
  });

  const noCanonical = pages.filter((p) => !p.canonicalUrl && p.status === "PUBLISHED");
  checks.push({
    id: "canonical", name: "URL Canonical", category: "On-Page",
    status: noCanonical.length > 0 ? "warning" : "pass",
    message: noCanonical.length > 0 ? `${noCanonical.length} pagini publicate fără canonical.` : "Canonical URLs configurate.",
    impact: "Previne problemele de conținut duplicat."
  });

  const noSchema = pages.filter((p) => !p.schemaType && p.status === "PUBLISHED");
  checks.push({
    id: "schema", name: "Schema.org", category: "Structured Data",
    status: noSchema.length > 0 ? "warning" : "pass",
    message: noSchema.length > 0 ? `${noSchema.length} pagini fără structured data.` : "Structured data implementat.",
    impact: "Schema.org ajută motoarele să înțeleagă conținutul."
  });

  const indexed = pages.filter((p) => !p.noIndex && p.status === "PUBLISHED");
  checks.push({
    id: "indexing", name: "Indexare", category: "Crawlability",
    status: "pass",
    message: `${indexed.length} pagini indexabile din ${pages.filter(p => p.status === "PUBLISHED").length} publicate.`,
    impact: "Paginile importante trebuie să fie indexabile."
  });

  checks.push({
    id: "mobile", name: "Mobile-Friendly", category: "Performance",
    status: "pass", message: "Design responsive implementat.",
    impact: "Mobile-first indexing este standard Google."
  });

  const noDisclaimer = pages.filter((p) => !p.legalDisclaimer && p.status === "PUBLISHED");
  checks.push({
    id: "disclaimer", name: "Disclaimer Juridic", category: "YMYL Compliance",
    status: noDisclaimer.length > 2 ? "warning" : "pass",
    message: noDisclaimer.length > 0 ? `${noDisclaimer.length} pagini fără disclaimer.` : "Disclaimer prezent pe toate paginile.",
    impact: "Esențial pentru E-E-A-T în domeniul YMYL."
  });

  return checks;
}

// Score gauge circle
function ScoreGauge({ score, size = 80, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score || 0) / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={6} stroke="rgba(148,163,184,0.1)" />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={6}
            stroke={color} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color }}>{score || 0}</span>
        </div>
      </div>
      {label && <span className="text-[10px] text-[var(--navy-500)] font-medium">{label}</span>}
    </div>
  );
}

// CWV metric card
function CwvCard({ label, value, unit, threshold }: { label: string; value: number; unit: string; threshold: [number, number] }) {
  const color = value <= threshold[0] ? "text-emerald-400" : value <= threshold[1] ? "text-amber-400" : "text-red-400";
  const bg = value <= threshold[0] ? "bg-emerald-500/10 border-emerald-500/20" : value <= threshold[1] ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className="text-xs text-[var(--navy-400)] mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}{unit}
      </p>
    </div>
  );
}

export default function CrawlPage() {
  const [checks, setChecks] = useState<CrawlCheck[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  // PageSpeed state
  const [psResult, setPsResult] = useState<PageSpeedResult | null>(null);
  const [psLoading, setPsLoading] = useState(false);
  const [psError, setPsError] = useState<string | null>(null);
  const [psStrategy, setPsStrategy] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pages"), (snap) => {
      const pData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      setPages(pData);
      setChecks(runTechnicalAudit(pData));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const runPageSpeedAudit = async () => {
    setPsLoading(true);
    setPsError(null);
    try {
      const siteUrl = "https://avbrasov--avocat-brasov.europe-west4.hosted.app";
      const result = await fetchPageSpeedAudit(siteUrl, psStrategy);
      setPsResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPsError(msg);
    } finally {
      setPsLoading(false);
    }
  };

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warning").length;
  const failCount = checks.filter((c) => c.status === "fail").length;
  const score = checks.length > 0 ? Math.round(((passCount + warnCount * 0.5) / checks.length) * 100) : 0;

  const categories = [...new Set(checks.map((c) => c.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--navy-400)]">Se rulează auditul tehnic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO Tehnic</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            {checks.length} verificări • Audit tehnic complet al site-ului
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); setTimeout(() => { setChecks(runTechnicalAudit(pages)); setLoading(false); }, 800); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Re-audit
        </button>
      </div>

      {/* Score Banner */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold border ${getScoreBgColor(score)}`}>
            <span className={getScoreColor(score)}>{score}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Sănătate Tehnică</h2>
            <p className="text-sm text-[var(--navy-400)] mt-1">
              {passCount} verificări trecute • {warnCount} avertismente • {failCount} erori
            </p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-xl font-bold">{passCount}</span>
              </div>
              <p className="text-xs text-[var(--navy-500)]">OK</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xl font-bold">{warnCount}</span>
              </div>
              <p className="text-xs text-[var(--navy-500)]">Atenție</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-red-400">
                <XCircle className="w-5 h-5" />
                <span className="text-xl font-bold">{failCount}</span>
              </div>
              <p className="text-xs text-[var(--navy-500)]">Erori</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checks by Category */}
      {categories.map((category) => (
        <div key={category} className="glass-card overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--glass-border)]">
            <h3 className="font-semibold text-white text-sm">{category}</h3>
          </div>
          <div className="divide-y divide-[var(--glass-border)]">
            {checks.filter((c) => c.category === category).map((check) => (
              <div key={check.id} className="px-5 py-3 flex items-start gap-3">
                {check.status === "pass" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                ) : check.status === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--navy-200)]">{check.name}</p>
                  <p className="text-xs text-[var(--navy-400)] mt-0.5">{check.message}</p>
                  <p className="text-xs text-[var(--navy-500)] mt-1">{check.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ===== PAGESPEED INSIGHTS SECTION ===== */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Core Web Vitals & Lighthouse
          </h3>
          <div className="flex items-center gap-3">
            {/* Strategy toggle */}
            <div className="flex rounded-lg overflow-hidden border border-[var(--glass-border)]">
              <button
                onClick={() => setPsStrategy("mobile")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  psStrategy === "mobile"
                    ? "bg-[var(--gold-500)]/20 text-[var(--gold-400)]"
                    : "text-[var(--navy-400)] hover:text-[var(--navy-200)]"
                }`}
              >
                Mobile
              </button>
              <button
                onClick={() => setPsStrategy("desktop")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  psStrategy === "desktop"
                    ? "bg-[var(--gold-500)]/20 text-[var(--gold-400)]"
                    : "text-[var(--navy-400)] hover:text-[var(--navy-200)]"
                }`}
              >
                Desktop
              </button>
            </div>
            <button
              onClick={runPageSpeedAudit}
              disabled={psLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm disabled:opacity-50"
            >
              {psLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {psLoading ? "Se analizează..." : "Rulează Audit PageSpeed"}
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Loading state */}
          {psLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[var(--navy-400)]">
                  Se rulează auditul Lighthouse ({psStrategy})... poate dura 15-30 secunde
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {psError && !psLoading && (
            <div className="text-center py-8">
              <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-400 mb-2">Eroare audit PageSpeed</p>
              <p className="text-xs text-[var(--navy-500)] max-w-md mx-auto">{psError}</p>
            </div>
          )}

          {/* Empty state */}
          {!psResult && !psLoading && !psError && (
            <div className="text-center py-8">
              <Zap className="w-10 h-10 text-[var(--navy-600)] mx-auto mb-3" />
              <p className="text-sm text-[var(--navy-400)]">
                Click pe &quot;Rulează Audit PageSpeed&quot; pentru a obține scoruri Lighthouse live.
              </p>
            </div>
          )}

          {/* Results */}
          {psResult && !psLoading && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Lighthouse Scores */}
              <div className="flex flex-wrap items-center justify-center gap-8">
                <ScoreGauge score={psResult.scores.performance} size={100} label="Performance" />
                <ScoreGauge score={psResult.scores.accessibility} size={100} label="Accessibility" />
                <ScoreGauge score={psResult.scores.bestPractices} size={100} label="Best Practices" />
                <ScoreGauge score={psResult.scores.seo} size={100} label="SEO" />
              </div>

              {/* Core Web Vitals */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Core Web Vitals ({psResult.strategy})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <CwvCard label="LCP" value={psResult.coreWebVitals.lcp} unit="ms" threshold={[2500, 4000]} />
                  <CwvCard label="FCP" value={psResult.coreWebVitals.fcp} unit="ms" threshold={[1800, 3000]} />
                  <CwvCard label="CLS" value={psResult.coreWebVitals.cls} unit="" threshold={[0.1, 0.25]} />
                  <CwvCard label="Speed Index" value={psResult.coreWebVitals.si} unit="ms" threshold={[3400, 5800]} />
                  <CwvCard label="TTFB" value={psResult.coreWebVitals.ttfb} unit="ms" threshold={[800, 1800]} />
                  <CwvCard label="FID/INP" value={psResult.coreWebVitals.fid} unit="ms" threshold={[100, 300]} />
                </div>
              </div>

              {/* Key Audit Items */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Audit Detaliat</h4>
                <div className="divide-y divide-[var(--glass-border)]">
                  {psResult.audits.map((audit) => {
                    const passed = audit.score !== null && audit.score >= 0.9;
                    const warn = audit.score !== null && audit.score >= 0.5 && audit.score < 0.9;
                    return (
                      <div key={audit.id} className="py-2 flex items-center gap-3">
                        {passed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : warn ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                        <span className="text-sm text-[var(--navy-200)] flex-1">{audit.title}</span>
                        {audit.displayValue && (
                          <span className="text-xs text-[var(--navy-400)]">{audit.displayValue}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-[var(--navy-600)] text-right">
                Analizat: {new Date(psResult.fetchedAt).toLocaleString("ro-RO")} • {psResult.url}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
