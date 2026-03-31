"use client";

import { useState, useEffect } from "react";
import {
  FileText, AlertTriangle, CheckCircle, Eye, TrendingUp,
  TrendingDown, Link2, Search, BarChart3, Shield, Globe, Clock,
  ArrowUpRight, ChevronRight, Wifi, AlertCircle, MapPin, 
  Settings as SettingsIcon, Zap, Target, Activity
} from "lucide-react";
import Link from "next/link";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analyzePage } from "@/lib/analyzer";
import type { PageAnalysis, AnalysisIssue, Page, InternalLink, OfficeLocation } from "@/types";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/utils";
import { fetchSearchPerformance } from "@/lib/actions/gsc.actions";
import type { GscData } from "@/lib/actions/gsc.actions";

// Score Gauge Component
function ScoreGauge({ score, size = 80, label, description }: { score: number; size?: number; label?: string; description?: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score || 0) / 100) * circumference;
  const color = score >= 80 ? "var(--gold-500)" : score >= 60 ? "#fbbf24" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            fill="transparent" 
            stroke="var(--stone-900)" 
            strokeWidth="6" 
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tighter" style={{ color }}>{score || 0}</span>
          {label && <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--stone-500)]">{label}</span>}
        </div>
      </div>
      {description && <p className="text-[10px] text-[var(--stone-500)] font-bold uppercase tracking-widest text-center">{description}</p>}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, sub, color, href }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  color: string; href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4 h-full">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[var(--premium-border)] bg-[var(--stone-950)] text-[var(--stone-400)] group-hover:text-[var(--gold-500)] group-hover:border-[var(--gold-500)]/30 transition-all`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-[var(--stone-100)] tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mt-1">{label}</p>
        {sub && <p className="text-[10px] text-[var(--stone-600)] mt-1 italic font-medium">{sub}</p>}
      </div>
      {href && (
        <div className="p-1.5 rounded-lg bg-[var(--stone-950)] border border-[var(--premium-border)] opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
          <ChevronRight className="w-3.5 h-3.5 text-[var(--gold-500)]" />
        </div>
      )}
    </div>
  );

  const className = "premium-card p-6 group cursor-pointer h-full hover:shadow-2xl hover:shadow-[var(--gold-500)]/5 transition-all";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <div className={className}>
      {content}
    </div>
  );
}

// Issue Row
function IssueRow({ issue, pageTitle }: { issue: AnalysisIssue & { pageTitle?: string }; pageTitle?: string }) {
  const severityStyles = {
    critical: "text-red-400 bg-red-400/5 border-red-400/10",
    warning: "text-amber-400 bg-amber-400/5 border-amber-400/10",
    info: "text-blue-400 bg-blue-400/5 border-blue-400/10",
    success: "text-emerald-400 bg-emerald-400/5 border-emerald-400/10",
  };

  return (
    <div className="group flex items-start gap-4 py-4 px-6 hover:bg-[var(--stone-900)]/30 transition-all border-b border-[var(--premium-border)] last:border-0">
      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${issue.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
           <span className={`text-[9px] font-bold tracking-widest uppercase border px-1.5 py-0.5 rounded ${severityStyles[issue.severity]}`}>
            {issue.severity}
          </span>
          <p className="text-[10px] text-[var(--stone-500)] font-bold uppercase tracking-widest truncate">{pageTitle}</p>
        </div>
        <p className="text-sm font-medium text-[var(--stone-200)] leading-snug">{issue.message}</p>
        <p className="text-xs text-[var(--stone-500)] mt-2 font-medium italic">Recomandare: {issue.recommendation}</p>
      </div>
      <div className="text-[10px] font-bold text-[var(--stone-600)] uppercase tracking-tighter self-center bg-[var(--stone-950)] px-2 py-1 rounded border border-[var(--premium-border)]">
        {issue.category}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [links, setLinks] = useState<InternalLink[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [analyses, setAnalyses] = useState<(PageAnalysis & { pageTitle: string })[]>([]);
  const [loading, setLoading] = useState(true);

  // GSC state
  const [gscData, setGscData] = useState<GscData | null>(null);
  const [gscLoading, setGscLoading] = useState(true);
  const [gscError, setGscError] = useState<string | null>(null);

  useEffect(() => {
    let pagesData: Page[] = [];
    let linksData: InternalLink[] = [];

    const unsubs: (() => void)[] = [];

    const qPages = query(collection(db, "pages"), orderBy("updatedAt", "desc"));
    const unsubPages = onSnapshot(qPages, (snap) => {
      pagesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      setPages(pagesData);
      computeAnalyses(pagesData, linksData);
    }, (err) => {
      console.error("Pages snapshot error:", err);
      setLoading(false);
    });
    unsubs.push(unsubPages);

    const qLinks = query(collection(db, "internal_links"), orderBy("createdAt", "desc"));
    const unsubLinks = onSnapshot(qLinks, (snap) => {
      linksData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalLink));
      setLinks(linksData);
      computeAnalyses(pagesData, linksData);
    }, (err) => {
      console.error("Links snapshot error:", err);
      setLoading(false);
    });
    unsubs.push(unsubLinks);

    const qLocs = query(collection(db, "office_locations"), orderBy("order", "asc"));
    const unsubLocs = onSnapshot(qLocs, (snap) => {
       setLocations(snap.docs.map(d => ({ id: d.id, ...d.data() } as OfficeLocation)));
    });
    unsubs.push(unsubLocs);

    // Safety timeout to prevent infinite spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Fetch GSC data
    fetchSearchPerformance()
      .then((data) => {
        setGscData(data);
        setGscLoading(false);
      })
      .catch((err) => {
        setGscError(err instanceof Error ? err.message : String(err));
        setGscLoading(false);
      });

    return () => {
      unsubs.forEach(unsub => unsub());
      clearTimeout(timer);
    };
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
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[var(--gold-500)]/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,168,83,0.3)]" />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-[var(--gold-500)] uppercase tracking-[0.4em] mb-1">Centru de Comandă</p>
            <p className="text-[10px] text-[var(--stone-500)] font-medium uppercase tracking-widest">Sincronizare LIVE Date Firestore</p>
          </div>
        </div>
      </div>
    );
  }

  const publishedPages = pages.filter((p) => p.status === "PUBLISHED");
  const avgOverall = analyses.length > 0 ? Math.round(analyses.reduce((s, a) => s + a.scores.overallScore, 0) / analyses.length) : 0;
  const avgSeo = analyses.length > 0 ? Math.round(analyses.reduce((s, a) => s + a.scores.seoScore, 0) / analyses.length) : 0;
  const avgEeat = analyses.length > 0 ? Math.round(analyses.reduce((s, a) => s + a.scores.eeatScore, 0) / analyses.length) : 0;
  const avgContent = analyses.length > 0 ? Math.round(analyses.reduce((s, a) => s + a.scores.contentQualityScore, 0) / analyses.length) : 0;

  const criticalIssues = analyses.flatMap((a) =>
    a.issues.filter((i) => i.severity === "critical").map((i) => ({ ...i, pageTitle: a.pageTitle }))
  );
  const warningIssues = analyses.flatMap((a) =>
    a.issues.filter((i) => i.severity === "warning").map((i) => ({ ...i, pageTitle: a.pageTitle }))
  );

  // GSC totals
  const totalClicks = gscData?.totals.clicks || 0;
  const avgCtr = gscData?.totals.ctr || 0;

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-widest">
                <Activity className="w-3 h-3" /> System Online
              </span>
              <span className="text-[9px] font-bold text-[var(--stone-500)] uppercase tracking-widest">
                {new Date().toLocaleDateString("ro-RO", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
           </div>
          <h1 className="text-4xl font-bold text-[var(--stone-100)] uppercase tracking-tight">Centru de Comandă</h1>
          <p className="text-xs text-[var(--stone-500)] font-bold uppercase tracking-[0.2em] mt-1 ml-1 flex items-center gap-2">
            Monitorizare Legal SEO & Performanță Digitală 
            <span className="inline-block w-1 h-1 rounded-full bg-[var(--stone-700)]" />
            V1.2 Premium Edition
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/admin/settings" className="p-3 rounded-xl bg-[var(--stone-900)] border border-[var(--premium-border)] text-[var(--stone-400)] hover:text-[var(--gold-500)] hover:border-[var(--gold-500)]/30 transition-all group">
             <SettingsIcon className="w-5 h-5 group-hover:rotate-45 transition-transform" />
           </Link>
           <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 px-8 py-3 rounded-xl bg-[var(--gold-500)] text-[var(--stone-950)] font-bold text-sm hover:bg-[var(--gold-400)] transition-all shadow-2xl shadow-[var(--gold-500)]/20 uppercase tracking-widest"
          >
            <Zap className="w-4 h-4" />
            Refresh Analiză
          </button>
        </div>
      </div>

      {/* Hero Overview: Large Score & Quick Stats */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 premium-card p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="absolute top-0 right-0 p-4">
             <Target className="w-24 h-24 text-[var(--gold-500)] opacity-[0.03] absolute -top-4 -right-4" />
          </div>
          
          <ScoreGauge score={avgOverall} size={160} label="SITE SCORE" description={getScoreLabel(avgOverall)} />
          
          <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
            <div>
               <h2 className="text-2xl font-bold text-[var(--stone-100)] tracking-tight">Performanță Generală Site</h2>
               <p className="text-xs text-[var(--stone-500)] leading-relaxed font-bold uppercase tracking-widest mt-1">
                 Calculat pe baza a {pages.length} pagini active
               </p>
            </div>
            <p className="text-sm text-[var(--stone-400)] leading-relaxed">
              Site-ul prezintă o sănătate SEO {avgOverall >= 80 ? 'excelentă' : 'bună'}. {criticalIssues.length > 0 ? `Atenție: s-au detectat ${criticalIssues.length} erori critice care pot afecta indexarea.` : 'Nu s-au detectat erori critice majore.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--stone-950)] border border-[var(--premium-border)]">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-500)]" />
                 <span className="text-[10px] font-bold text-[var(--stone-400)] uppercase tracking-widest">SEO: {avgSeo}%</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--stone-950)] border border-[var(--premium-border)]">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-bold text-[var(--stone-400)] uppercase tracking-widest">EEAT: {avgEeat}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <StatCard icon={FileText} label="Total Pagini" value={pages.length} sub={`${publishedPages.length} Publicate Online`} color="bg-blue-500" href="/admin/pages" />
           <StatCard icon={MapPin} label="Sedii Fizice" value={locations.length} sub={`${locations.filter(l => l.isActive).length} Sedii Active`} color="bg-emerald-500" href="/admin/locations" />
        </div>

        <div className="lg:col-span-1 space-y-6">
           <StatCard icon={TrendingUp} label="Clickuri Google" value={gscLoading ? "..." : totalClicks} sub={`CTR Mediu: ${avgCtr}%`} color="bg-amber-500" href="/admin/performance" />
           <StatCard icon={AlertTriangle} label="Alerte SEO" value={criticalIssues.length} sub={`${warningIssues.length} Avertismente`} color="bg-red-500" href="/admin/analyzer" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Priority Issues */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.3em] flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-500" /> Issues Need Attention
              </h3>
              <Link href="/admin/analyzer" className="text-[10px] font-bold text-[var(--gold-500)] uppercase tracking-widest hover:text-[var(--stone-100)] transition-colors">
                Vezi tot raportul →
              </Link>
           </div>
           
           <div className="premium-card overflow-hidden divide-y divide-[var(--premium-border)]">
              {[...criticalIssues, ...warningIssues].slice(0, 8).map((issue, i) => (
                <IssueRow key={i} issue={issue} pageTitle={issue.pageTitle} />
              ))}
              {criticalIssues.length === 0 && warningIssues.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-[var(--stone-100)] uppercase tracking-widest mb-1">Optimizare Completă</p>
                  <p className="text-xs text-[var(--stone-500)] font-medium">Nu s-au găsit erori critice active la această analiză.</p>
                </div>
              )}
           </div>
        </div>

        {/* Top Pages & Performance Sidebar */}
        <div className="space-y-8">
           <div className="space-y-6">
              <h3 className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                <BarChart3 className="w-4 h-4 text-[var(--gold-500)]" /> Top Pages Score
              </h3>
              <div className="premium-card p-2 space-y-1">
                {analyses
                  .sort((a, b) => b.scores.overallScore - a.scores.overallScore)
                  .slice(0, 5)
                  .map((analysis) => (
                    <Link
                      key={analysis.pageId}
                      href={`/admin/analyzer/${analysis.pageId}`}
                      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--stone-900)] transition-all"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${getScoreBgColor(analysis.scores.overallScore)}`}>
                        <span className={getScoreColor(analysis.scores.overallScore)}>
                          {analysis.scores.overallScore}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--stone-200)] truncate group-hover:text-[var(--gold-500)] transition-colors">
                          {analysis.pageTitle?.replace(/ \|.*$/, "")}
                        </p>
                        <p className="text-[10px] font-bold text-[var(--stone-600)] uppercase tracking-widest mt-0.5">
                          {analysis.scores.overallScore >= 90 ? 'Premium Content' : 'Optimized'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--stone-700)] group-hover:text-[var(--gold-500)] transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
              </div>
           </div>

           {/* Google Search Quick View */}
           <div className="space-y-6">
              <h3 className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                <Globe className="w-4 h-4 text-emerald-500" /> Search Console
              </h3>
              <div className="premium-card p-6">
                 {gscLoading ? (
                   <div className="py-8 text-center space-y-3">
                      <div className="w-8 h-8 border-2 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-[10px] font-bold text-[var(--stone-600)] uppercase tracking-widest">Sincronizare Google API...</p>
                   </div>
                 ) : gscError ? (
                   <div className="py-4 text-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-amber-500/50 mx-auto" />
                      <p className="text-[10px] font-bold text-[var(--stone-600)] uppercase tracking-widest">Date GSC Indisponibile</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      {gscData?.entries.slice(0, 4).map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-[var(--stone-900)] last:border-0 border-dashed">
                           <div className="min-w-0 flex-1 pr-3">
                              <p className="text-xs font-bold text-[var(--stone-200)] truncate">{entry.query}</p>
                              <p className="text-[9px] text-[var(--stone-600)] font-bold uppercase tracking-tighter mt-0.5">Pos: {entry.position.toFixed(1)}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-bold text-[var(--gold-500)]">{entry.clicks}</p>
                              <p className="text-[9px] text-[var(--stone-600)] font-bold uppercase tracking-widest">clicks</p>
                           </div>
                        </div>
                      ))}
                      <Link href="/admin/performance" className="block text-center pt-2 text-[10px] font-bold text-[var(--stone-500)] hover:text-[var(--gold-500)] uppercase tracking-[0.2em] transition-colors">
                        Toate Datele de trafic →
                      </Link>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
