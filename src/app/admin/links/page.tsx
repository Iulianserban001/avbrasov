"use client";

import { useState, useEffect } from "react";
import {
  Link2, ArrowRight, CheckCircle, XCircle, Lightbulb,
  ExternalLink, ChevronRight, Filter, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateInternalLink } from "@/lib/firestore";
import type { InternalLink, Page } from "@/types";

type LinkFilter = "all" | "approved" | "suggested" | "auto";

export default function LinksPage() {
  const [filter, setFilter] = useState<LinkFilter>("all");
  const [links, setLinks] = useState<InternalLink[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));

    // Listen to links
    const qLinks = query(collection(db, "internal_links"), orderBy("createdAt", "desc"));
    const unsubLinks = onSnapshot(qLinks, (snapshot) => {
      const linksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InternalLink[];
      setLinks(linksData);
    });

    // Listen to pages for orphans calculation
    const qPages = query(collection(db, "pages"));
    const unsubPages = onSnapshot(qPages, async (snapshot) => {
      const pagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Page[];
      setPages(pagesData);
      
      await minLoadTime;
      setLoading(false);
    });

    return () => {
      unsubLinks();
      unsubPages();
    };
  }, []);

  const handleApprove = async (linkId: string) => {
    try {
      await updateInternalLink(linkId, { isApproved: true });
    } catch (err) {
      console.error("Eroare la aprobare link", err);
    }
  };

  const handleReject = async (linkId: string) => {
    try {
      await updateInternalLink(linkId, { isApproved: false, isSuggested: false });
    } catch (err) {
      console.error("Eroare la respingerea link-ului", err);
    }
  };

  const filteredLinks = links.filter((l) => {
    if (filter === "approved") return l.isApproved;
    if (filter === "suggested") return l.isSuggested && !l.isApproved;
    if (filter === "auto") return l.isAutomatic;
    return true;
  });

  const approvedCount = links.filter((l) => l.isApproved).length;
  const suggestedCount = links.filter((l) => l.isSuggested && !l.isApproved).length;
  const autoCount = links.filter((l) => l.isAutomatic).length;

  // Calculate orphan pages
  const linkedPageIds = new Set([
    ...links.map((l) => l.sourcePageId),
    ...links.map((l) => l.targetPageId),
  ]);
  const orphanPages = pages.filter((p) => !linkedPageIds.has(p.id) && p.pageType !== "HOMEPAGE");

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-[var(--navy-800)] rounded-xl w-64"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 glass-card"></div>)}
        </div>
        <div className="glass-card h-64"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Linking Intern</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            {links.length} linkuri totale • Optimizați structura de linking
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--gold-500)]/20 transition-all opacity-50 cursor-not-allowed" title="În curând">
          <Lightbulb className="w-4 h-4" />
          Generează Sugestii
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Linkuri", value: links.length, color: "bg-blue-500/20 text-blue-400", filter: "all" as LinkFilter },
          { label: "Aprobate", value: approvedCount, color: "bg-emerald-500/20 text-emerald-400", filter: "approved" as LinkFilter },
          { label: "Sugerate", value: suggestedCount, color: "bg-amber-500/20 text-amber-400", filter: "suggested" as LinkFilter },
          { label: "Pagini Orfane", value: orphanPages.length, color: "bg-red-500/20 text-red-400", filter: "all" as LinkFilter },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => setFilter(stat.filter)}
            className={`glass-card p-4 text-left transition-all hover:border-[var(--gold-500)]/20 ${
              filter === stat.filter ? "border-[var(--gold-500)]/40 bg-[var(--gold-500)]/5" : ""
            }`}
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-[var(--navy-500)] mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Orphan Pages Warning */}
      {orphanPages.length > 0 && (
        <div className="glass-card p-4 border-l-2 border-l-red-500 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-red-400">Pagini Orfane Detectate</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {orphanPages.map((p) => (
              <Link
                key={p.id}
                href={`/admin/analyzer/${p.id}`}
                className="text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                {p.title.replace(/ \|.*$/, "")}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Links Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--glass-border)] bg-[var(--navy-900)]/50">
          <Filter className="w-4 h-4 text-[var(--navy-500)]" />
          <div className="flex gap-1 flex-wrap">
            {(["all", "approved", "suggested", "auto"] as LinkFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${
                  filter === f
                    ? "bg-[var(--gold-500)]/20 text-[var(--gold-400)]"
                    : "text-[var(--navy-500)] hover:bg-[var(--glass-hover)] hover:text-[var(--navy-300)]"
                }`}
              >
                {f === "all" ? "Toate" : f === "approved" ? "Aprobate" : f === "suggested" ? "Sugerate" : "Automate"}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[var(--glass-border)]">
          {filteredLinks.length === 0 ? (
             <div className="p-8 text-center text-[var(--navy-400)]">
               <Link2 className="w-8 h-8 opacity-20 mx-auto mb-2" />
               <p className="text-sm">Niciun link găsit pentru acest filtru.</p>
             </div>
          ) : (
            filteredLinks.map((link, i) => (
              <div
                key={link.id}
                className="px-5 py-3 flex items-center gap-3 hover:bg-[var(--glass-hover)] transition-colors"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Status */}
                {link.isApproved ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : link.isSuggested ? (
                  <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <Link2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                )}

                {/* Source */}
                <div className="flex-1 min-w-[100px] truncate">
                  <p className="text-sm text-[var(--navy-300)] truncate">
                    {link.sourcePageTitle || link.sourcePageSlug}
                  </p>
                  <p className="text-xs text-[var(--navy-500)] truncate">
                    Ancoră: <span className="text-[var(--gold-400)]">&quot;{link.anchorText}&quot;</span>
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-[var(--navy-600)] flex-shrink-0 hidden sm:block" />

                {/* Target */}
                <div className="flex-1 min-w-[100px] truncate">
                  <p className="text-sm text-[var(--navy-300)] truncate">
                    {link.targetPageTitle || link.targetPageSlug}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {link.isSuggested && !link.isApproved && (
                    <>
                      <button onClick={() => handleApprove(link.id)} className="p-1.5 rounded-md hover:bg-emerald-500/20 text-[var(--navy-500)] hover:text-emerald-400 transition-colors" title="Aprobă">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleReject(link.id)} className="p-1.5 rounded-md hover:bg-red-500/20 text-[var(--navy-500)] hover:text-red-400 transition-colors" title="Respinge">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
