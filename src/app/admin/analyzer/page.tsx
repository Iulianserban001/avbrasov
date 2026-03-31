"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BarChart3, ChevronRight, AlertTriangle, CheckCircle, Filter } from "lucide-react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analyzePage } from "@/lib/analyzer";
import type { AnalysisScores, Page, InternalLink } from "@/types";
import { getScoreColor, getScoreLabel } from "@/lib/utils";

export default function AnalyzerOverviewPage() {
  const [analyses, setAnalyses] = useState<{ pageId: string; pageTitle: string; pageSlug: string; scores: AnalysisScores; issueCount: number; criticalCount: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"overallScore" | "seoScore" | "contentQualityScore" | "eeatScore" | "riskScore">("overallScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    let pagesData: Page[] = [];
    let linksData: InternalLink[] = [];

    const unsubs: (() => void)[] = [];

    const unsubPages = onSnapshot(collection(db, "pages"), (snap) => {
      pagesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      computeAnalyses(pagesData, linksData);
    });
    unsubs.push(unsubPages);

    const unsubLinks = onSnapshot(collection(db, "internal_links"), (snap) => {
      linksData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalLink));
      computeAnalyses(pagesData, linksData);
    });
    unsubs.push(unsubLinks);

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  const computeAnalyses = (pData: Page[], lData: InternalLink[]) => {
    if (!pData.length) {
      setAnalyses([]);
      setLoading(false);
      return;
    }

    const results = pData.map((page) => {
      const result = analyzePage(page, pData, lData);
      return {
        pageId: page.id,
        pageTitle: page.title?.replace(/ \|.*$/, "").replace(/ — .*$/, "") || "Fără titlu",
        pageSlug: page.slug,
        scores: result.scores,
        issueCount: result.issues.length,
        criticalCount: result.issues.filter((i) => i.severity === "critical").length,
      };
    });
    setAnalyses(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--navy-400)]">Se generează analiza live...</p>
        </div>
      </div>
    );
  }

  const sorted = [...analyses].sort((a, b) => {
    const diff = a.scores[sortBy] - b.scores[sortBy];
    return sortDir === "asc" ? diff : -diff;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-[var(--gold-400)]" />
            Analizor SEO
          </h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">Analiză completă a tuturor paginilor pe 10 dimensiuni</p>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="glass-card p-4 flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-[var(--navy-500)]" />
        <span className="text-xs text-[var(--navy-500)]">Sortează după:</span>
        {[
          { key: "overallScore", label: "General" },
          { key: "seoScore", label: "SEO" },
          { key: "contentQualityScore", label: "Conținut" },
          { key: "eeatScore", label: "E-E-A-T" },
          { key: "riskScore", label: "Risc" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => {
              if (sortBy === opt.key) setSortDir(sortDir === "asc" ? "desc" : "asc");
              else { setSortBy(opt.key as typeof sortBy); setSortDir("asc"); }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortBy === opt.key
                ? "bg-[var(--gold-500)]/20 text-[var(--gold-400)] border border-[var(--gold-500)]/30"
                : "bg-[var(--navy-800)] text-[var(--navy-400)] hover:text-[var(--navy-200)] border border-transparent"
            }`}
          >
            {opt.label} {sortBy === opt.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>
        ))}
      </div>

      {/* Analysis Cards */}
      <div className="space-y-3">
        {sorted.map((analysis) => (
          <Link
            key={analysis.pageId}
            href={`/admin/analyzer/${analysis.pageId}`}
            className="glass-card p-5 flex items-center gap-5 hover:border-[var(--gold-500)]/20 transition-all group"
          >
            {/* Overall Score */}
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold border ${
              analysis.scores.overallScore >= 80 ? "border-emerald-500/30 bg-emerald-500/10" :
              analysis.scores.overallScore >= 60 ? "border-amber-500/30 bg-amber-500/10" :
              "border-red-500/30 bg-red-500/10"
            }`}>
              <span className={getScoreColor(analysis.scores.overallScore)}>{analysis.scores.overallScore}</span>
            </div>

            {/* Page Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-[var(--gold-400)] transition-colors">
                {analysis.pageTitle}
              </p>
              <p className="text-xs text-[var(--navy-500)] mt-0.5">/{analysis.pageSlug}</p>
              <div className="flex items-center gap-4 mt-2">
                {analysis.criticalCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3" /> {analysis.criticalCount} critice
                  </span>
                )}
                <span className="text-xs text-[var(--navy-500)]">{analysis.issueCount} total probleme</span>
              </div>
            </div>

            {/* Dimension Scores */}
            <div className="hidden md:grid grid-cols-5 gap-2">
              {(["seoScore", "contentQualityScore", "eeatScore", "localRelevanceScore", "riskScore"] as const).map((dim) => (
                <div key={dim} className="text-center p-2 rounded-lg bg-[var(--navy-800)]/50">
                  <p className={`text-sm font-bold ${
                    dim === "riskScore" ? (analysis.scores[dim] <= 20 ? "text-emerald-400" : analysis.scores[dim] <= 40 ? "text-amber-400" : "text-red-400") : getScoreColor(analysis.scores[dim])
                  }`}>
                    {analysis.scores[dim]}
                  </p>
                  <p className="text-[9px] text-[var(--navy-500)]">
                    {dim === "seoScore" ? "SEO" : dim === "contentQualityScore" ? "Conținut" : dim === "eeatScore" ? "E-E-A-T" : dim === "localRelevanceScore" ? "Local" : "Risc"}
                  </p>
                </div>
              ))}
            </div>

            <ChevronRight className="w-5 h-5 text-[var(--navy-600)] group-hover:text-[var(--gold-400)] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
