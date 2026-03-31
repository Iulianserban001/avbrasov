"use client";

import { useState, useEffect } from "react";
import {
  GitBranch, CheckCircle, Clock, AlertTriangle, Eye,
  Shield, Send, XCircle, ChevronRight, FileText
} from "lucide-react";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analyzePage } from "@/lib/analyzer";
import type { PageAnalysis, Page, InternalLink } from "@/types";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";

type WorkflowTab = "review" | "ready" | "blocked" | "published";

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState<WorkflowTab>("review");
  const [analyses, setAnalyses] = useState<Map<string, PageAnalysis>>(new Map());
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pagesData: Page[] = [];
    let linksData: InternalLink[] = [];

    const unsubs: (() => void)[] = [];

    const unsubPages = onSnapshot(collection(db, "pages"), (snap) => {
      pagesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      setPages(pagesData);
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
      setAnalyses(new Map());
      setLoading(false);
      return;
    }
    const map = new Map<string, PageAnalysis>();
    pData.forEach((page) => {
      const result = analyzePage(page, pData, lData);
      map.set(page.id, {
        id: page.id,
        pageId: page.id,
        pageTitle: page.title || "Fără titlu",
        pageSlug: page.slug,
        scores: result.scores,
        issues: result.issues,
        analyzedAt: new Date().toISOString(),
      });
    });
    setAnalyses(map);
    setLoading(false);
  };

  const draftPages = pages.filter((p) => p.status === "DRAFT");
  const reviewPages = pages.filter((p) => p.status === "IN_REVIEW");
  const publishedPages = pages.filter((p) => p.status === "PUBLISHED");

  // Pages blocked by guardrails (score < 50 or critical YMYL issues)
  const blockedPages = [...draftPages, ...reviewPages].filter((p) => {
    const a = analyses.get(p.id);
    if (!a) return false;
    return a.scores.overallScore < 50 || a.scores.riskScore > 60;
  });

  // Pages ready to publish (score >= 70 and no critical guardrail failures)
  const readyPages = [...draftPages, ...reviewPages].filter((p) => {
    const a = analyses.get(p.id);
    if (!a) return false;
    return a.scores.overallScore >= 70 && a.scores.riskScore <= 40 && !blockedPages.includes(p);
  });

  const tabPages: Record<WorkflowTab, Page[]> = {
    review: reviewPages,
    ready: readyPages,
    blocked: blockedPages,
    published: publishedPages,
  };

  const tabs: { key: WorkflowTab; label: string; icon: React.ElementType; count: number; color: string }[] = [
    { key: "review", label: "In Review", icon: Eye, count: reviewPages.length, color: "text-amber-400" },
    { key: "ready", label: "Gata de Publicare", icon: CheckCircle, count: readyPages.length, color: "text-emerald-400" },
    { key: "blocked", label: "Blocate", icon: XCircle, count: blockedPages.length, color: "text-red-400" },
    { key: "published", label: "Publicate", icon: Send, count: publishedPages.length, color: "text-blue-400" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--navy-400)]">Se încarcă fluxul...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Flux de Publicare</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            Gestionati ciclul editorial cu verificari automate de calitate
          </p>
        </div>
      </div>

      {/* Guardrails Info */}
      <div className="glass-card p-4 border-l-2 border-l-[var(--gold-500)]">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[var(--gold-400)] mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white">Guardrails Editoriale Active</h3>
            <div className="grid md:grid-cols-3 gap-3 mt-2 text-xs text-[var(--navy-400)]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Blocheaza publicarea daca scor &lt; 50
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Blocheaza daca risc &gt; 60 (thin/duplicate)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Warning daca E-E-A-T &lt; 60 (YMYL)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[var(--glass-bg)] border border-[var(--gold-500)]/30 text-white"
                : "text-[var(--navy-500)] hover:text-[var(--navy-300)] hover:bg-[var(--glass-hover)]"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? tab.color : ""}`} />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
              activeTab === tab.key ? "bg-[var(--navy-800)] text-[var(--navy-200)]" : "bg-[var(--navy-900)] text-[var(--navy-500)]"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Page List */}
      <div className="space-y-3">
        {tabPages[activeTab].map((page, i) => {
          const analysis = analyses.get(page.id);
          const score = analysis?.scores.overallScore || 0;
          const criticals = analysis?.issues.filter((i) => i.severity === "critical").length || 0;
          const isBlocked = blockedPages.includes(page);

          return (
            <div
              key={page.id}
              className="glass-card p-4 flex items-center gap-4 group hover:border-[var(--gold-500)]/20 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Score */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold border ${getScoreBgColor(score)}`}>
                <span className={getScoreColor(score)}>{score}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  {page.title.replace(/ \|.*$/, "")}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--navy-500)]">
                  <span className="capitalize">{page.pageType.toLowerCase().replace('_', ' ')}</span>
                  <span className="w-px h-3 bg-[var(--glass-border)]" />
                  <span>{criticals} critice</span>
                  {page.authorName && (
                    <>
                      <span className="w-px h-3 bg-[var(--glass-border)]" />
                      <span>{page.authorName}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2">
                {isBlocked && (
                  <span className="badge bg-red-500/20 text-red-400 border-red-500/30 text-[10px] flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> BLOCAT
                  </span>
                )}
                {!isBlocked && score >= 70 && activeTab !== "published" && (
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                    <Send className="w-3 h-3" />
                    Publica
                  </button>
                )}
                {activeTab === "published" && page.publishedAt && (
                  <span className="text-xs text-[var(--navy-500)]">
                    {new Date(page.publishedAt).toLocaleDateString("ro-RO")}
                  </span>
                )}
              </div>

              {/* View */}
              <Link
                href={`/admin/analyzer/${page.id}`}
                className="p-2 rounded-lg hover:bg-[var(--glass-hover)] text-[var(--navy-500)] hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}

        {tabPages[activeTab].length === 0 && (
          <div className="glass-card p-12 text-center">
            <GitBranch className="w-10 h-10 text-[var(--navy-600)] mx-auto mb-3" />
            <p className="text-[var(--navy-400)]">Nicio pagina in aceasta categorie</p>
          </div>
        )}
      </div>
    </div>
  );
}
