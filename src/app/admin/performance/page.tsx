"use client";

import {
  BarChart3, TrendingUp, TrendingDown, Globe, MousePointerClick,
  Eye, Target, ArrowUpRight, ArrowDownRight
} from "lucide-react";

// Mock data until GSC integration is built
const mockSearchPerformance = [
  { id: "sp1", query: "avocat brasov", pageUrl: "/", clicks: 350, impressions: 4200, ctr: 8.3, position: 2.4, device: "MOBILE", date: "2024-03-24" },
  { id: "sp2", query: "avocat divort brasov", pageUrl: "/servicii/drept-familiei", clicks: 120, impressions: 850, ctr: 14.1, position: 1.2, device: "MOBILE", date: "2024-03-24" },
  { id: "sp3", query: "infiintare firma brasov", pageUrl: "/servicii/drept-comercial", clicks: 85, impressions: 1100, ctr: 7.7, position: 4.5, device: "DESKTOP", date: "2024-03-24" },
  { id: "sp4", query: "avocat penal brasov", pageUrl: "/servicii/drept-penal", clicks: 65, impressions: 920, ctr: 7.0, position: 3.8, device: "MOBILE", date: "2024-03-24" },
  { id: "sp5", query: "cat costa un divort", pageUrl: "/ghiduri/costuri-divort", clicks: 45, impressions: 1500, ctr: 3.0, position: 8.1, device: "MOBILE", date: "2024-03-24" },
];

export default function PerformancePage() {
  const totalClicks = mockSearchPerformance.reduce((s, e) => s + e.clicks, 0);
  const totalImpressions = mockSearchPerformance.reduce((s, e) => s + e.impressions, 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgPosition = mockSearchPerformance.length > 0 ? mockSearchPerformance.reduce((s, e) => s + e.position, 0) / mockSearchPerformance.length : 0;

  const topQueries = [...mockSearchPerformance].sort((a, b) => b.clicks - a.clicks);
  const topByImp = [...mockSearchPerformance].sort((a, b) => b.impressions - a.impressions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Performanta Cautari</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            Date mock Search Console • Ultimele 30 de zile
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--navy-500)] bg-amber-500/10 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/20">
            Date simulate
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Clickuri", value: totalClicks, icon: MousePointerClick, color: "text-blue-400", bg: "bg-blue-500/20", change: "+12.3%", up: true },
          { label: "Impresii", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-purple-400", bg: "bg-purple-500/20", change: "+8.7%", up: true },
          { label: "CTR Mediu", value: `${avgCtr.toFixed(1)}%`, icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/20", change: "+0.3%", up: true },
          { label: "Pozitie Medie", value: avgPosition.toFixed(1), icon: BarChart3, color: "text-amber-400", bg: "bg-amber-500/20", change: "-1.2", up: true },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <span className={`text-xs flex items-center gap-0.5 ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs text-[var(--navy-500)] mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Queries by Clicks */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--glass-border)]">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Top Cautari (Clickuri)
            </h3>
          </div>
          <div className="divide-y divide-[var(--glass-border)]">
            {topQueries.map((entry, i) => (
              <div key={entry.id} className="px-5 py-3 flex items-center gap-3 hover:bg-[var(--glass-hover)] transition-colors">
                <span className="w-6 text-center text-xs font-bold text-[var(--navy-500)]">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--navy-200)] truncate">{entry.query}</p>
                  <p className="text-xs text-[var(--navy-500)]">{entry.pageUrl}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{entry.clicks}</p>
                  <p className="text-xs text-[var(--navy-500)]">clickuri</p>
                </div>
                <div className="w-16 text-right">
                  <span className={entry.position <= 5 ? "text-emerald-400" : entry.position <= 10 ? "text-amber-400" : "text-red-400"}>
                    <span className="text-xs">#{entry.position.toFixed(1)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Queries by Impressions */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--glass-border)]">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              Top Vizibilitate (Impresii)
            </h3>
          </div>
          <div className="divide-y divide-[var(--glass-border)]">
            {topByImp.map((entry, i) => (
              <div key={entry.id} className="px-5 py-3 flex items-center gap-3 hover:bg-[var(--glass-hover)] transition-colors">
                <span className="w-6 text-center text-xs font-bold text-[var(--navy-500)]">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--navy-200)] truncate">{entry.query}</p>
                  <p className="text-xs text-[var(--navy-500)]">{entry.pageUrl}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{entry.impressions.toLocaleString()}</p>
                  <p className="text-xs text-[var(--navy-500)]">impresii</p>
                </div>
                <div className="w-16 text-right">
                  <span className={`text-xs ${entry.ctr >= 5 ? "text-emerald-400" : entry.ctr >= 2 ? "text-amber-400" : "text-red-400"}`}>
                    CTR {entry.ctr}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--glass-border)]">
          <h3 className="font-semibold text-white">Toate Cautarile</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--navy-500)] text-xs uppercase tracking-wider border-b border-[var(--glass-border)]">
                <th className="px-5 py-3">Query</th>
                <th className="px-5 py-3">URL</th>
                <th className="px-5 py-3 text-right">Clickuri</th>
                <th className="px-5 py-3 text-right">Impresii</th>
                <th className="px-5 py-3 text-right">CTR</th>
                <th className="px-5 py-3 text-right">Pozitie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {mockSearchPerformance.map((entry) => (
                <tr key={entry.id} className="hover:bg-[var(--glass-hover)] transition-colors">
                  <td className="px-5 py-3 text-[var(--navy-200)] font-medium">{entry.query}</td>
                  <td className="px-5 py-3 text-[var(--navy-500)] text-xs">{entry.pageUrl}</td>
                  <td className="px-5 py-3 text-right text-[var(--navy-200)]">{entry.clicks}</td>
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
    </div>
  );
}
