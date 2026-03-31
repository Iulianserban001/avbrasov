"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, AlertTriangle, CheckCircle, Eye, TrendingUp,
  TrendingDown, Link2, Search, BarChart3, Shield, Globe, Clock,
  ArrowUpRight, ChevronRight, Wifi, AlertCircle, MapPin, 
  Settings as SettingsIcon, Zap, Target, Activity, Rocket,
  ExternalLink, Layers, MousePointer2
} from "lucide-react";
import Link from "next/link";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analyzePage } from "@/lib/analyzer";
import type { PageAnalysis, AnalysisIssue, Page, InternalLink, OfficeLocation } from "@/types";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/utils";
import { fetchSearchPerformance } from "@/lib/actions/gsc.actions";
import type { GscData } from "@/lib/actions/gsc.actions";

// Animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

// Score Gauge Component
function ScoreGauge({ score, size = 100, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score || 0) / 100) * circumference;
  const color = score >= 80 ? "var(--emerald-500)" : score >= 60 ? "var(--gold-500)" : "#ef4444";

  return (
    <div className="relative group" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle 
          cx={size / 2} cy={size / 2} r={radius} 
          fill="transparent" 
          stroke="var(--stone-800)" 
          strokeWidth="8" 
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "circOut" }}
          cx={size / 2} cy={size / 2} r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tracking-tighter" style={{ color }}>{score || 0}</span>
        {label && <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--stone-500)] mt-[-4px]">{label}</span>}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, sub, trend, href }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  trend?: { val: string; up: boolean }; href?: string;
}) {
  const content = (
    <motion.div variants={item} className="premium-card p-6 h-full flex flex-col justify-between group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--stone-800)] flex items-center justify-center text-[var(--stone-400)] group-hover:text-[var(--gold-500)] transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold ${trend.up ? 'text-emerald-400' : 'text-red-400'} bg-stone-950 px-2 py-0.5 rounded-full border border-white/5`}>
            {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.val}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-black text-[var(--stone-100)] tracking-tight">{value}</p>
        <p className="text-[10px] font-black text-[var(--stone-500)] uppercase tracking-[0.2em] mt-1">{label}</p>
        {sub && <p className="text-[10px] text-[var(--stone-600)] mt-2 font-bold uppercase tracking-widest">{sub}</p>}
      </div>
      {href && (
        <div className="mt-4 pt-4 border-t border-[var(--premium-border)] flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-[var(--stone-500)] group-hover:text-[var(--gold-500)] transition-colors">
          Manage Data
          <ChevronRight className="w-3 h-3" />
        </div>
      )}
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [analyses, setAnalyses] = useState<(PageAnalysis & { pageTitle: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [gscData, setGscData] = useState<GscData | null>(null);

  useEffect(() => {
    let pagesData: Page[] = [];
    let lData: InternalLink[] = [];

    const unsubPages = onSnapshot(query(collection(db, "pages"), orderBy("updatedAt", "desc")), (snap) => {
      pagesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      setPages(pagesData);
      computeAnalyses(pagesData, lData);
    });

    const unsubLocs = onSnapshot(query(collection(db, "office_locations")), (snap) => {
       setLocations(snap.docs.map(d => ({ id: d.id, ...d.data() } as OfficeLocation)));
    });

    fetchSearchPerformance().then(setGscData).catch(console.error);

    return () => {
      unsubPages();
      unsubLocs();
    };
  }, []);

  const computeAnalyses = (pData: Page[], lData: InternalLink[]) => {
    const results = pData.map((page) => {
      const result = analyzePage(page, pData, lData);
      return { id: page.id, pageId: page.id, pageTitle: page.title, pageSlug: page.slug, scores: result.scores, issues: result.issues, analyzedAt: new Date().toISOString() };
    });
    setAnalyses(results);
    setLoading(false);
  };

  const avgOverall = analyses.length > 0 ? Math.round(analyses.reduce((s, a) => s + a.scores.overallScore, 0) / analyses.length) : 0;
  const criticalCount = analyses.reduce((count, a) => count + a.issues.filter(i => i.severity === 'critical').length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--gold-500)]/10 border-t-[var(--gold-500)] rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold-500)]">Initializing Command Center</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20"
    >
      {/* Top Banner: Status & Action */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--premium-border)] pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Sistem Activ</span>
             </div>
             <span className="text-[9px] font-black text-[var(--stone-600)] uppercase tracking-widest">Build 2.0 Professional</span>
          </div>
          <h1 className="text-5xl font-black text-[var(--stone-100)] tracking-tighter uppercase italic">Centru Comandă</h1>
          <p className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.25em] max-w-xl">
            Monitorizare digitală de înaltă precizie pentru Cabinetul de Avocatură Brașov.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/admin/settings" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--stone-900)] border border-[var(--premium-border)] text-sm font-black uppercase tracking-widest text-[var(--stone-100)] hover:border-[var(--gold-500)] transition-all group">
             <SettingsIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
             Branding Settings
           </Link>
           <Link href="/" target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--gold-500)] text-[var(--stone-950)] text-sm font-black uppercase tracking-widest hover:bg-[var(--gold-400)] transition-all shadow-xl shadow-[var(--gold-500)]/20">
             <ExternalLink className="w-4 h-4" />
             Preview Site
           </Link>
        </div>
      </motion.div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FileText} label="Pagini Web" value={pages.length} sub="Indexate în motor cautare" trend={{ val: "+23%", up: true }} href="/admin/pages" />
        <StatCard icon={MousePointer2} label="Clickuri Google" value={gscData?.totals.clicks || 0} sub="Perioada: Ultimele 28 zile" trend={{ val: "7.2%", up: true }} href="/admin/performance" />
        <StatCard icon={Target} label="Conversii" value="128" sub="Contacte directe & Telefoane" trend={{ val: "4.1%", up: false }} />
        <StatCard icon={MapPin} label="Sedii Fizice" value={locations.length} sub="Locații Google Business" href="/admin/locations" />
      </div>

      {/* Optimization Score Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2 premium-card p-10 flex flex-col md:flex-row items-center gap-12 bg-gradient-to-br from-[var(--stone-900)] to-[var(--stone-950)]">
           <div className="relative">
              <div className="absolute inset-0 bg-[var(--gold-500)] opacity-20 blur-[60px]" />
              <ScoreGauge score={avgOverall} label="Score" />
           </div>
           <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-black text-[var(--stone-100)] tracking-tighter uppercase italic">Sănătate Digitală</h3>
              <p className="text-sm text-[var(--stone-400)] leading-relaxed">
                Platforma evaluează constant autoritatea site-ului (EEAT), performanța tehnică și calitatea conținutului juridic. Site-ul tău funcționează la un nivel suboptim și necesită ajustări.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <p className="text-[9px] font-black text-[var(--stone-500)] uppercase tracking-widest">Erori Critice</p>
                    <p className="text-xl font-black text-red-500 tracking-tighter">{criticalCount}</p>
                 </div>
                 <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <p className="text-[9px] font-black text-[var(--stone-500)] uppercase tracking-widest">Sănătate SEO</p>
                    <p className="text-xl font-black text-emerald-500 tracking-tighter">{avgOverall}%</p>
                 </div>
              </div>
           </div>
        </motion.div>

        <motion.div variants={item} className="premium-card p-8 space-y-6">
           <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-[var(--gold-500)]" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--stone-100)]">Analiză SEO Rapidă</h3>
           </div>
           <div className="space-y-4">
              {analyses.slice(0, 4).map((analysis) => (
                <Link key={analysis.id} href={`/admin/analyzer/${analysis.id}`} className="block group">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-black text-[var(--stone-200)] truncate uppercase tracking-tighter group-hover:text-[var(--gold-500)] transition-colors">
                      {analysis.pageTitle?.replace(/\|.*$/, "")}
                    </p>
                    <span className={`text-[10px] font-bold ${getScoreColor(analysis.scores.overallScore)}`}>{analysis.scores.overallScore}%</span>
                  </div>
                  <div className="h-1 bg-[var(--stone-800)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.scores.overallScore}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${analysis.scores.overallScore >= 80 ? 'bg-emerald-500' : 'bg-[var(--gold-500)]'}`}
                    />
                  </div>
                </Link>
              ))}
              <Link href="/admin/analyzer" className="flex items-center justify-center gap-2 mt-6 p-3 rounded-xl border border-[var(--premium-border)] text-[9px] font-black uppercase tracking-[0.2em] text-[var(--stone-500)] hover:text-[var(--gold-500)] hover:border-[var(--gold-500)]/30 transition-all">
                Vezi tot Analizorul <ChevronRight className="w-3 h-3" />
              </Link>
           </div>
        </motion.div>
      </div>

      {/* Quick Links / Navigation Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Branding', icon: Layers, href: '/admin/settings' },
           { label: 'Map Locs', icon: MapPin, href: '/admin/locations' },
           { label: 'Content', icon: FileText, href: '/admin/pages' },
           { label: 'Links', icon: Link2, href: '/admin/links' },
         ].map((nav, i) => (
           <motion.div key={i} variants={item}>
             <Link href={nav.href} className="premium-card p-4 flex items-center justify-between hover:bg-[var(--stone-800)] transition-all group">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--stone-400)] group-hover:text-[var(--stone-100)]">
                  <nav.icon className="w-4 h-4 text-[var(--stone-700)] group-hover:text-[var(--gold-500)]" />
                  {nav.label}
               </div>
               <ArrowUpRight className="w-3 h-3 text-[var(--stone-800)] group-hover:text-[var(--gold-500)] transition-all" />
             </Link>
           </motion.div>
         ))}
      </div>
    </motion.div>
  );
}
