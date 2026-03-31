"use client";

import { useState, useEffect } from "react";
import {
  FileText, AlertTriangle, CheckCircle, Eye, TrendingUp,
  TrendingDown, Link2, Search, BarChart3, Shield, Globe, Clock,
  ArrowUpRight, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analyzePage } from "@/lib/analyzer";
import type { PageAnalysis, AnalysisIssue, Page, InternalLink } from "@/types";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/utils";

// Score Gauge Component
function ScoreGauge({ score, size = 80, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score || 0) / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="score-gauge" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(148,163,184,0.1)" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
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

// Stat Card Component
function StatCard({ icon: Icon, label, value, sub, color, href }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  color: string; href?: string;
}) {
  const content = (
    <>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-[var(--navy-400)] mt-0.5">{label}</p>
        {sub && <p className="text-xs text-[var(--navy-500)] mt-1">{sub}</p>}
      </div>
      {href && (
        <ArrowUpRight className="w-4 h-4 text-[var(--navy-600)] group-hover:text-[var(--gold-400)] transition-colors" />
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} className="glass-card p-5 flex items-start gap-4 animate-fade-in-up group cursor-pointer">
        {content}
      </Link>
    );
  }
  return (
    <div className="glass-card p-5 flex items-start gap-4 animate-fade-in-up group cursor-pointer">
      {content}
    </div>
  );
}

// Issue Row
function IssueRow({ issue, pageTitle }: { issue: AnalysisIssue & { pageTitle?: string }; pageTitle?: string }) {
  const severityColors = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  return (
    <div className="flex items-start gap-3 py-3 px-4 hover:bg-[var(--glass-hover)] rounded-lg transition-colors">
      <span className={`badge text-[10px] mt-0.5 ${severityColors[issue.severity]}`}>
        {issue.severity === "critical" ? "CRITIC" : issue.severity === "warning" ? "ATENȚIE" : "INFO"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--navy-200)]">{issue.message}</p>
        {pageTitle && <p className="text-xs text-[var(--navy-500)] mt-0.5">{pageTitle}</p>}
        <p className="text-xs text-[var(--navy-400)] mt-1">{issue.recommendation}</p>
      </div>
      <span className="text-xs text-[var(--navy-500)] whitespace-nowrap">{issue.category}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [links, setLinks] = useState<InternalLink[]>([]);
  const [analyses, setAnalyses] = useState<(PageAnalysis & { pageTitle: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pagesData: Page[] = [];
    let linksData: InternalLink[] = [];

    const unsubs: (() => void)[] = [];

    // Listen to pages
    const qPages = query(collection(db, "pages"), orderBy("updatedAt", "desc"));
    const unsubPages = onSnapshot(qPages, (snap) => {
      pagesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      setPages(pagesData);
      computeAnalyses(pagesData, linksData);
    });
    unsubs.push(unsubPages);

    // Listen to internal_links
    const qLinks = query(collection(db, "internal_links"), orderBy("createdAt", "desc"));
    const unsubLinks = onSnapshot(qLinks, (snap) => {
      linksData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalLink));
      setLinks(linksData);
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
        id: page.id,
        pageId: page.id,
        pageTitle: page.title,
        pageSlug: page.slug,
        scores: result.scores,
        issues: result.issues,
        analyzedAt: new Date().toISOString(),
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
          <p className="text-[var(--navy-400)]">Se încarcă datele live...</p>
        </div>
      </div>
    );
  }

  const publishedPages = pages.filter((p) => p.status === "PUBLISHED");
  const draftPages = pages.filter((p) => p.status === "DRAFT");
  const avgOverall = Math.round(analyses.reduce((s, a) => s + a.scores.overallScore, 0) / analyses.length);
  const avgSeo = Math.round(analyses.reduce((s, a) => s + a.scores.seoScore, 0) / analyses.length);
  const avgEeat = Math.round(analyses.reduce((s, a) => s + a.scores.eeatScore, 0) / analyses.length);
  const avgContent = Math.round(analyses.reduce((s, a) => s + a.scores.contentQualityScore, 0) / analyses.length);

  const criticalIssues = analyses.flatMap((a) =>
    a.issues.filter((i) => i.severity === "critical").map((i) => ({ ...i, pageTitle: a.pageTitle }))
  );
  const warningIssues = analyses.flatMap((a) =>
    a.issues.filter((i) => i.severity === "warning").map((i) => ({ ...i, pageTitle: a.pageTitle }))
  );

  const weakPages = analyses.filter((a) => a.scores.overallScore < 60);
  const strongPages = analyses.filter((a) => a.scores.overallScore >= 80);

  // Performance data
  const searchPerformance: any[] = [];
  const totalClicks = searchPerformance.reduce((s, e) => s + e.clicks, 0);
  const totalImpressions = searchPerformance.reduce((s, e) => s + e.impressions, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Centru de Comandă SEO</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            Ultima analiză: {new Date().toLocaleDateString("ro-RO")} • {pages.length} pagini • {criticalIssues.length} probleme critice
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--gold-500)]/20 transition-all"
        >
          <Search className="w-4 h-4" />
          Re-analizează
        </button>
      </div>

      {/* Overall Score Banner */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgba(212,168,83,0.05)]" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <ScoreGauge score={avgOverall} size={120} />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-white">Scor General: {getScoreLabel(avgOverall)}</h2>
            <p className="text-sm text-[var(--navy-400)] mt-1 max-w-lg">
              Media scorului tuturor paginilor publicate. {avgOverall >= 70 ? "Site-ul este în formă bună." : "Sunt îmbunătățiri necesare."} {criticalIssues.length > 0 ? `${criticalIssues.length} probleme critice necesită atenție imediată.` : ""}
            </p>
          </div>
          <div className="flex gap-6">
            <ScoreGauge score={avgSeo} size={64} label="SEO" />
            <ScoreGauge score={avgContent} size={64} label="Conținut" />
            <ScoreGauge score={avgEeat} size={64} label="E-E-A-T" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Pagini" value={pages.length} sub={`${publishedPages.length} publicate`} color="bg-blue-500/20 text-blue-400" href="/admin/pages" />
        <StatCard icon={AlertTriangle} label="Probleme Critice" value={criticalIssues.length} sub={`${warningIssues.length} avertismente`} color="bg-red-500/20 text-red-400" href="/admin/analyzer" />
        <StatCard icon={TrendingUp} label="Clickuri (30 zile)" value={totalClicks} sub={`CTR mediu: ${avgCtr}%`} color="bg-emerald-500/20 text-emerald-400" href="/admin/performance" />
        <StatCard icon={Link2} label="Linkuri Interne" value={links.length} sub={`${links.filter((l) => l.isSuggested).length} sugerate`} color="bg-purple-500/20 text-purple-400" href="/admin/links" />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Critical Issues */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Probleme Prioritare
            </h3>
            <Link href="/admin/analyzer" className="text-xs text-[var(--gold-400)] hover:underline flex items-center gap-1">
              Vezi toate <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[var(--glass-border)] max-h-[400px] overflow-y-auto">
            {[...criticalIssues, ...warningIssues].slice(0, 10).map((issue, i) => (
              <IssueRow key={i} issue={issue} pageTitle={issue.pageTitle} />
            ))}
            {criticalIssues.length === 0 && warningIssues.length === 0 && (
              <div className="px-5 py-8 text-center text-[var(--navy-500)]">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                Nicio problemă critică detectată!
              </div>
            )}
          </div>
        </div>

        {/* Page Scores */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[var(--gold-400)]" />
              Scoruri Pagini
            </h3>
          </div>
          <div className="divide-y divide-[var(--glass-border)] max-h-[400px] overflow-y-auto">
            {analyses
              .sort((a, b) => a.scores.overallScore - b.scores.overallScore)
              .map((analysis) => (
                <Link
                  key={analysis.pageId}
                  href={`/admin/analyzer/${analysis.pageId}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--glass-hover)] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border ${getScoreBgColor(analysis.scores.overallScore)}`}>
                    <span className={getScoreColor(analysis.scores.overallScore)}>
                      {analysis.scores.overallScore}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--navy-200)] truncate">
                      {analysis.pageTitle?.replace(/ \|.*$/, "")}
                    </p>
                    <p className="text-xs text-[var(--navy-500)]">
                      {analysis.issues.filter((i) => i.severity === "critical").length} critice •{" "}
                      {analysis.issues.filter((i) => i.severity === "warning").length} atenționări
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--navy-600)]" />
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Search Performance Preview */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            Top Căutări (Mock GSC Data)
          </h3>
          <Link href="/admin/performance" className="text-xs text-[var(--gold-400)] hover:underline flex items-center gap-1">
            Performanță completă <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--navy-500)] text-xs uppercase tracking-wider border-b border-[var(--glass-border)]">
                <th className="px-5 py-3">Query</th>
                <th className="px-5 py-3 text-right">Clickuri</th>
                <th className="px-5 py-3 text-right">Impresii</th>
                <th className="px-5 py-3 text-right">CTR</th>
                <th className="px-5 py-3 text-right">Poziție</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {searchPerformance.slice(0, 6).map((entry) => (
                <tr key={entry.id} className="hover:bg-[var(--glass-hover)] transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-[var(--navy-200)]">{entry.query}</span>
                    <span className="text-xs text-[var(--navy-500)] block mt-0.5">{entry.pageUrl}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-[var(--navy-200)] font-medium">{entry.clicks}</td>
                  <td className="px-5 py-3 text-right text-[var(--navy-400)]">{entry.impressions.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={entry.ctr >= 5 ? "text-emerald-400" : entry.ctr >= 2 ? "text-amber-400" : "text-red-400"}>
                      {entry.ctr}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={entry.position <= 5 ? "text-emerald-400" : entry.position <= 10 ? "text-amber-400" : "text-red-400"}>
                      {entry.position.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/admin/pages/new", label: "Pagină Nouă", icon: FileText, desc: "Creați o pagină nouă" },
          { href: "/admin/analyzer", label: "Analiză Completă", icon: Search, desc: "Analizați tot site-ul" },
          { href: "/admin/links", label: "Sugestii Linkuri", icon: Link2, desc: "Oportunități de linking" },
          { href: "/admin/workflow", label: "În Așteptare", icon: Clock, desc: "Pagini de review" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="glass-card p-4 flex flex-col items-center text-center gap-2 hover:border-[var(--gold-500)]/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--navy-800)] flex items-center justify-center group-hover:bg-[var(--gold-500)]/10 transition-colors">
              <action.icon className="w-5 h-5 text-[var(--navy-400)] group-hover:text-[var(--gold-400)] transition-colors" />
            </div>
            <span className="text-sm font-medium text-[var(--navy-200)]">{action.label}</span>
            <span className="text-xs text-[var(--navy-500)]">{action.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
