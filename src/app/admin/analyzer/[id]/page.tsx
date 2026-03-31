"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Search, Shield, FileText, Link2, Globe, Zap, Users,
  Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, BarChart3, TrendingUp
} from "lucide-react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analyzePage, checkPublishingGuardrails } from "@/lib/analyzer";
import type { AnalysisScores, AnalysisIssue, Page, InternalLink } from "@/types";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/utils";

const dimensionMeta: Record<keyof Omit<AnalysisScores, "overallScore">, { label: string; icon: React.ElementType; description: string }> = {
  seoScore: { label: "SEO", icon: Search, description: "Calitatea titlului, meta description, URL, heading-uri, canonical" },
  technicalSeoScore: { label: "SEO Tehnic", icon: Zap, description: "Indexabilitate, schema, linkuri, breadcrumb-uri, mobile" },
  contentQualityScore: { label: "Calitate Conținut", icon: FileText, description: "Lungime, structură, FAQ, lizibilitate, acoperire tematică" },
  eeatScore: { label: "E-E-A-T", icon: Shield, description: "Autor, reviewer, credențiale, disclaimer, citări" },
  localRelevanceScore: { label: "Relevanță Locală", icon: Globe, description: "Mențiuni locale, instituții, FAQ local, unicitate" },
  aiSearchReadiness: { label: "AI Readiness", icon: TrendingUp, description: "Structură răspuns, definiții, extractabilitate, claritate" },
  conversionClarityScore: { label: "Conversie", icon: Users, description: "CTA, telefon, proces, încredere, eligibilitate" },
  internalLinkingScore: { label: "Linking Intern", icon: Link2, description: "Linkuri ieșire/intrare, calitate ancoră, cluster" },
  freshnessScore: { label: "Prospețime", icon: Clock, description: "Date publicare, actualizare, reverificare, referințe curente" },
  riskScore: { label: "Risc", icon: AlertTriangle, description: "Duplicare, thin content, doorway, keyword stuffing" },
};

function ScoreGauge({ score, size = 100 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";
  return (
    <div className="score-gauge relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(148,163,184,0.1)" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[10px] text-[var(--navy-500)]">/100</span>
      </div>
    </div>
  );
}

function DimensionCard({ dimension, score, issues, isRisk }: {
  dimension: keyof Omit<AnalysisScores, "overallScore">; score: number; issues: AnalysisIssue[]; isRisk?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = dimensionMeta[dimension];
  const Icon = meta.icon;
  const displayScore = isRisk ? score : score;
  const displayColor = isRisk
    ? (score <= 20 ? "#10b981" : score <= 40 ? "#f59e0b" : "#ef4444")
    : (score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444");

  return (
    <div className="glass-card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-4 p-4 hover:bg-[var(--glass-hover)] transition-colors text-left">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--navy-800)]" style={{ borderColor: displayColor + "30", borderWidth: 1 }}>
          <span className="text-xl font-bold" style={{ color: displayColor }}>{displayScore}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[var(--navy-400)]" />
            <span className="text-sm font-semibold text-white">{meta.label}</span>
            {isRisk && <span className="text-[10px] badge badge-draft">scor mic = bine</span>}
          </div>
          <p className="text-xs text-[var(--navy-500)] mt-0.5">{meta.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {issues.length > 0 && (
            <span className="text-xs text-[var(--navy-500)]">{issues.length} {issues.length === 1 ? "problemă" : "probleme"}</span>
          )}
          {expanded ? <ChevronDown className="w-4 h-4 text-[var(--navy-500)]" /> : <ChevronRight className="w-4 h-4 text-[var(--navy-500)]" />}
        </div>
      </button>
      {expanded && issues.length > 0 && (
        <div className="border-t border-[var(--glass-border)] divide-y divide-[var(--glass-border)]">
          {issues.map((issue, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <span className={`badge text-[10px] mt-0.5 ${
                issue.severity === "critical" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                issue.severity === "warning" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                "bg-blue-500/20 text-blue-400 border-blue-500/30"
              }`}>
                {issue.severity === "critical" ? "CRITIC" : issue.severity === "warning" ? "ATENȚIE" : "INFO"}
              </span>
              <div className="flex-1">
                <p className="text-sm text-[var(--navy-200)]">{issue.message}</p>
                {issue.recommendation && <p className="text-xs text-[var(--navy-400)] mt-1">💡 {issue.recommendation}</p>}
              </div>
              <span className={`badge text-[10px] ${
                issue.impact === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                issue.impact === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                {issue.impact === "high" ? "Impact Mare" : issue.impact === "medium" ? "Impact Mediu" : "Impact Mic"}
              </span>
            </div>
          ))}
        </div>
      )}
      {expanded && issues.length === 0 && (
        <div className="border-t border-[var(--glass-border)] px-5 py-4 text-center">
          <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-xs text-emerald-400">Totul este în regulă!</p>
        </div>
      )}
    </div>
  );
}

export default function AnalyzerDetailPage() {
  const params = useParams();
  const pageId = params.id as string;
  
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ReturnType<typeof analyzePage> | null>(null);
  const [guardrails, setGuardrails] = useState<ReturnType<typeof checkPublishingGuardrails> | null>(null);

  useEffect(() => {
    let pagesData: Page[] = [];
    let linksData: InternalLink[] = [];

    const unsubs: (() => void)[] = [];

    const unsubPages = onSnapshot(collection(db, "pages"), (snap) => {
      pagesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      computeEverything();
    });
    unsubs.push(unsubPages);

    const unsubLinks = onSnapshot(collection(db, "internal_links"), (snap) => {
      linksData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalLink));
      computeEverything();
    });
    unsubs.push(unsubLinks);

    const computeEverything = () => {
      if (!pagesData.length || !linksData.length) return;
      
      const targetPage = pagesData.find((p) => p.id === pageId);
      if (targetPage) {
        setPage(targetPage);
        const res = analyzePage(targetPage, pagesData, linksData);
        setResult(res);
        setGuardrails(checkPublishingGuardrails(targetPage, res));
      }
      setLoading(false);
    };

    return () => unsubs.forEach(unsub => unsub());
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--navy-400)]">Se încarcă analiza...</p>
        </div>
      </div>
    );
  }

  if (!page || !result || !guardrails) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-[var(--navy-400)]">Pagina nu a fost găsită.</p>
          <Link href="/admin/analyzer" className="text-[var(--gold-400)] text-sm hover:underline mt-2 inline-block">← Înapoi</Link>
        </div>
      </div>
    );
  }

  const dimensions = Object.keys(dimensionMeta) as (keyof Omit<AnalysisScores, "overallScore">)[];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/analyzer" className="mt-1 p-2 rounded-lg hover:bg-[var(--glass-hover)] text-[var(--navy-500)] hover:text-[var(--navy-200)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{page.title.replace(/ \|.*$/, "")}</h1>
          <p className="text-sm text-[var(--navy-500)] mt-1">/{page.slug}</p>
        </div>
      </div>

      {/* Overall Score + Guardrails */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-6 flex items-center gap-6">
          <ScoreGauge score={result.scores.overallScore} size={120} />
          <div>
            <h2 className="text-lg font-bold text-white">Scor General</h2>
            <p className={`text-sm font-medium mt-1 ${getScoreColor(result.scores.overallScore)}`}>
              {getScoreLabel(result.scores.overallScore)}
            </p>
            <p className="text-xs text-[var(--navy-500)] mt-2">
              {result.issues.filter((i) => i.severity === "critical").length} critice •{" "}
              {result.issues.filter((i) => i.severity === "warning").length} atenționări •{" "}
              {result.issues.filter((i) => i.severity === "info").length} informații
            </p>
          </div>
        </div>

        <div className={`glass-card p-6 ${guardrails.canPublish ? "border-emerald-500/20" : "border-red-500/20"}`}>
          <div className="flex items-center gap-2 mb-3">
            {guardrails.canPublish ? (
              <><CheckCircle className="w-5 h-5 text-emerald-400" /><h3 className="font-semibold text-emerald-400">Poate fi publicată</h3></>
            ) : (
              <><AlertTriangle className="w-5 h-5 text-red-400" /><h3 className="font-semibold text-red-400">Nu poate fi publicată</h3></>
            )}
          </div>
          {guardrails.blockers.length > 0 && (
            <ul className="space-y-1">
              {guardrails.blockers.map((b, i) => (
                <li key={i} className="text-xs text-red-400 flex items-start gap-1.5">
                  <span className="mt-0.5">✕</span> {b}
                </li>
              ))}
            </ul>
          )}
          {guardrails.warnings.length > 0 && (
            <ul className="space-y-1 mt-2">
              {guardrails.warnings.map((w, i) => (
                <li key={i} className="text-xs text-amber-400 flex items-start gap-1.5">
                  <span className="mt-0.5">⚠</span> {w}
                </li>
              ))}
            </ul>
          )}
          {guardrails.canPublish && guardrails.warnings.length === 0 && (
            <p className="text-xs text-emerald-400/70">Toate verificările de publicare au trecut.</p>
          )}
        </div>
      </div>

      {/* Score Matrix */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--gold-400)]" />
          Matrice Scoruri
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {dimensions.map((dim) => {
            const score = result.scores[dim];
            const isRisk = dim === "riskScore";
            const displayColor = isRisk
              ? (score <= 20 ? "text-emerald-400" : score <= 40 ? "text-amber-400" : "text-red-400")
              : getScoreColor(score);
            return (
              <div key={dim} className="text-center p-3 rounded-xl bg-[var(--navy-800)]/50">
                <p className={`text-2xl font-bold ${displayColor}`}>{score}</p>
                <p className="text-[10px] text-[var(--navy-500)] mt-1">{dimensionMeta[dim].label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dimension Details */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-[var(--gold-400)]" />
          Analiză Detaliată ({result.issues.length} probleme identificate)
        </h3>
        {dimensions.map((dim) => (
          <DimensionCard
            key={dim}
            dimension={dim}
            score={result.scores[dim]}
            issues={result.issues.filter((i) => i.dimension === dim)}
            isRisk={dim === "riskScore"}
          />
        ))}
      </div>
    </div>
  );
}
