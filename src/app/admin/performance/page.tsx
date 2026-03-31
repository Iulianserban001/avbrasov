"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3, TrendingUp, Globe, MousePointerClick,
  Eye, Target, ArrowUpRight, ArrowDownRight, RefreshCw,
  AlertCircle, Wifi, Activity, Zap, ExternalLink
} from "lucide-react";
import { fetchSearchPerformance } from "@/lib/actions/gsc.actions";
import type { GscData, SearchPerformanceEntry } from "@/lib/actions/gsc.actions";

export default function PerformancePage() {
  const [data, setData] = useState<GscData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSearchPerformance();
      setData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-[var(--gold-500)]/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-[0.3em]">Interogare API Google...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-[var(--stone-100)] uppercase tracking-tight">Performanță Căutări</h1>
          <p className="text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mt-2">Google Search Console Integration</p>
        </div>
        <div className="premium-card p-12 text-center border-red-500/10">
          <AlertCircle className="w-12 h-12 text-red-500/50 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[var(--stone-100)] uppercase tracking-tight mb-2">Eroare Conexiune GSC</h2>
          <p className="text-sm text-[var(--stone-500)] max-w-md mx-auto mb-8 leading-relaxed font-medium">{error}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-[var(--gold-500)] text-[var(--stone-950)] font-bold text-sm hover:bg-[var(--gold-400)] transition-all uppercase tracking-widest"
          >
            <RefreshCw className="w-4 h-4" />
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.entries.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-[var(--stone-100)] uppercase tracking-tight">Performanță Căutări</h1>
          <p className="text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mt-2">Google Search Console Integration</p>
        </div>
        <div className="premium-card p-12 text-center">
          <Globe className="w-12 h-12 text-[var(--stone-800)] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[var(--stone-100)] uppercase tracking-tight mb-2">Lipsă Date Indexare</h2>
          <p className="text-sm text-[var(--stone-500)] max-w-md mx-auto leading-relaxed border-t border-[var(--premium-border)] pt-4 mt-4 uppercase tracking-[0.05em] text-[10px] font-bold">
            Nu s-au găsit date pentru acest domeniu. Verificați statutul proprietății în portalul Google Search Console.
          </p>
        </div>
      </div>
    );
  }

  const { entries, totals, dateRange } = data;
  const topQueries = [...entries].sort((a, b) => b.clicks - a.clicks);
  const topByImp = [...entries].sort((a, b) => b.impressions - a.impressions);

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-widest">
                <Wifi className="w-3 h-3" /> API LIVE
              </span>
              <span className="text-[9px] font-bold text-[var(--stone-500)] uppercase tracking-widest">
                Interval: {dateRange.start} — {dateRange.end}
              </span>
           </div>
          <h1 className="text-3xl font-bold text-[var(--stone-100)] uppercase tracking-tight">Performanță Căutări</h1>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[var(--stone-900)] border border-[var(--premium-border)] text-[var(--stone-100)] font-bold text-xs hover:border-[var(--gold-500)] transition-all uppercase tracking-widest"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizează Datele
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Clickuri", value: totals.clicks, icon: MousePointerClick, color: "text-[var(--stone-100)]", bg: "bg-[var(--stone-950)]", sub: "User Engagement" },
          { label: "Impresii totale", value: totals.impressions.toLocaleString(), icon: Eye, color: "text-[var(--stone-100)]", bg: "bg-[var(--stone-950)]", sub: "Brand Awareness" },
          { label: "CTR Mediu", value: `${totals.ctr.toFixed(1)}%`, icon: Target, color: "text-[var(--gold-500)]", bg: "bg-[var(--stone-950)]", sub: "Click-Through Rate" },
          { label: "Poziție Medie", value: totals.position.toFixed(1), icon: BarChart3, color: "text-[var(--stone-100)]", bg: "bg-[var(--stone-950)]", sub: "Search Authority" },
        ].map((kpi) => (
          <div key={kpi.label} className="premium-card p-6 flex flex-col items-center text-center">
            <div className={`w-10 h-10 rounded-xl ${kpi.bg} border border-[var(--premium-border)] flex items-center justify-center mb-4`}>
              <kpi.icon className={`w-4 h-4 text-[var(--stone-400)]`} />
            </div>
            <p className="text-3xl font-bold text-[var(--stone-100)] tracking-tighter mb-1">{kpi.value}</p>
            <p className="text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest">{kpi.label}</p>
            <p className="text-[8px] font-bold text-[var(--stone-700)] uppercase tracking-[0.2em] mt-2">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Queries by Clicks */}
        <div className="space-y-6">
           <h3 className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.3em] flex items-center gap-2 px-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Top Căutări (Clickuri)
           </h3>
           <div className="premium-card overflow-hidden">
             <div className="divide-y divide-[var(--premium-border)]">
               {topQueries.slice(0, 15).map((entry, i) => (
                 <div key={entry.id} className="group px-6 py-4 flex items-center gap-4 hover:bg-[var(--stone-900)]/30 transition-all">
                   <span className="w-5 text-[10px] font-bold text-[var(--stone-700)]">
                     {(i + 1).toString().padStart(2, '0')}
                   </span>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-[var(--stone-100)] truncate group-hover:text-[var(--gold-500)] transition-colors">{entry.query}</p>
                     <p className="text-[10px] text-[var(--stone-600)] font-medium truncate mt-0.5">{entry.pageUrl}</p>
                   </div>
                   <div className="text-right shrink-0">
                     <p className="text-sm font-bold text-[var(--stone-100)]">{entry.clicks}</p>
                     <p className="text-[9px] font-bold text-[var(--stone-600)] uppercase tracking-tighter">clickuri</p>
                   </div>
                   <div className="w-12 text-right">
                     <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${entry.position <= 10 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[var(--stone-950)] text-[var(--stone-500)] border border-[var(--premium-border)]'}`}>
                       #{entry.position.toFixed(1)}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Top Queries by Impressions */}
        <div className="space-y-6">
           <h3 className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.3em] flex items-center gap-2 px-2">
              <Activity className="w-4 h-4 text-[var(--gold-500)]" /> Top Vizibilitate (Impresii)
           </h3>
           <div className="premium-card overflow-hidden">
             <div className="divide-y divide-[var(--premium-border)]">
               {topByImp.slice(0, 15).map((entry, i) => (
                 <div key={entry.id} className="group px-6 py-4 flex items-center gap-4 hover:bg-[var(--stone-900)]/30 transition-all">
                   <span className="w-5 text-[10px] font-bold text-[var(--stone-700)]">
                     {(i + 1).toString().padStart(2, '0')}
                   </span>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-[var(--stone-100)] truncate group-hover:text-[var(--gold-500)] transition-colors">{entry.query}</p>
                     <p className="text-[10px] text-[var(--stone-600)] font-medium truncate mt-0.5">{entry.pageUrl}</p>
                   </div>
                   <div className="text-right shrink-0">
                     <p className="text-sm font-bold text-[var(--stone-100)]">{entry.impressions.toLocaleString()}</p>
                     <p className="text-[9px] font-bold text-[var(--stone-600)] uppercase tracking-tighter">impresii</p>
                   </div>
                   <div className="w-16 text-right">
                     <span className={`text-[10px] font-bold ${entry.ctr >= 5 ? "text-emerald-400" : "text-[var(--stone-500)]"}`}>
                       {entry.ctr}% CTR
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Full Audit Table */}
      <div className="space-y-6">
         <h3 className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.3em] px-2 flex items-center justify-between">
           <span>Tabel Detaliat Performanță</span>
           <span className="text-[var(--stone-700)] tracking-tighter normal-case font-medium">{entries.length} Rezultate</span>
         </h3>
         <div className="premium-card overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-[var(--stone-950)] border-b border-[var(--premium-border)]">
                   <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest">Query & Destination URL</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest text-right">Clickuri</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest text-right">Impresii</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest text-right">CTR %</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest text-right">Poziție</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[var(--premium-border)]">
                 {entries.map((entry) => (
                   <tr key={entry.id} className="hover:bg-[var(--stone-900)]/20 transition-colors group">
                     <td className="px-6 py-4">
                       <p className="text-sm font-medium text-[var(--stone-100)]">{entry.query}</p>
                       <p className="text-[10px] text-[var(--stone-600)] font-medium mt-0.5 truncate max-w-sm">{entry.pageUrl}</p>
                     </td>
                     <td className="px-6 py-4 text-right font-bold text-[var(--stone-200)]">{entry.clicks}</td>
                     <td className="px-6 py-4 text-right text-[var(--stone-500)] font-medium">{entry.impressions.toLocaleString()}</td>
                     <td className="px-6 py-4 text-right text-[var(--stone-400)] font-bold">{entry.ctr}%</td>
                     <td className="px-6 py-4 text-right">
                       <span className={`text-xs font-bold ${entry.position <= 10 ? 'text-[var(--gold-500)]' : 'text-[var(--stone-600)]'}`}>
                         #{entry.position.toFixed(1)}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
      </div>
    </div>
  );
}
