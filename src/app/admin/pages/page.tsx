"use client";

import Link from "next/link";
import { FileText, Plus, Search, Filter, ChevronRight, Eye, Edit, BarChart } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PageType, PageStatus, Page } from "@/types";

const statusLabels: Record<PageStatus, { label: string; class: string }> = {
  DRAFT: { label: "Ciornă", class: "badge-draft" },
  IN_REVIEW: { label: "În review", class: "badge-in-review" },
  APPROVED: { label: "Aprobată", class: "badge-approved" },
  SCHEDULED: { label: "Programată", class: "badge-in-review" },
  PUBLISHED: { label: "Publicată", class: "badge-published" },
  UPDATE_REQUIRED: { label: "Necesită actualizare", class: "badge-update-required" },
  ARCHIVED: { label: "Arhivată", class: "badge-archived" },
};

const typeLabels: Record<PageType, string> = {
  HOMEPAGE: "Acasă",
  MONEY_PAGE: "Money Page",
  SERVICE_HUB: "Serviciu",
  SERVICE_DETAIL: "Detaliu Serviciu",
  LOCALITY: "Localitate",
  ATTORNEY_PROFILE: "Profil Avocat",
  GUIDE: "Ghid",
  FAQ_PAGE: "FAQ",
  CONTACT: "Contact",
  LEGAL_PAGE: "Legal",
};

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PageStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<PageType | "ALL">("ALL");

  useEffect(() => {
    const q = query(collection(db, "pages"), orderBy("updatedAt", "desc"));
    return onSnapshot(q, (snap) => {
      setPages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page)));
      setLoading(false);
    });
  }, []);

  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase()) && !p.slug.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (typeFilter !== "ALL" && p.pageType !== typeFilter) return false;
      return true;
    });
  }, [pages, searchTerm, statusFilter, typeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--gold-500)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--navy-400)]">Se încarcă paginile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pagini</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">{pages.length} pagini total • {pages.filter((p) => p.status === "PUBLISHED").length} publicate</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm"
        >
          <Plus className="w-4 h-4" />
          Pagină Nouă
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--navy-500)]" />
          <input
            type="text"
            placeholder="Caută pagini..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--navy-800)] border border-[var(--glass-border)] text-sm text-[var(--navy-200)] placeholder-[var(--navy-600)] focus:outline-none focus:border-[var(--gold-500)]/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PageStatus | "ALL")}
          className="px-3 py-2 rounded-lg bg-[var(--navy-800)] border border-[var(--glass-border)] text-sm text-[var(--navy-300)] focus:outline-none focus:border-[var(--gold-500)]/50"
        >
          <option value="ALL">Toate statusurile</option>
          {Object.entries(statusLabels).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as PageType | "ALL")}
          className="px-3 py-2 rounded-lg bg-[var(--navy-800)] border border-[var(--glass-border)] text-sm text-[var(--navy-300)] focus:outline-none focus:border-[var(--gold-500)]/50"
        >
          <option value="ALL">Toate tipurile</option>
          {Object.entries(typeLabels).map(([key, val]) => (
            <option key={key} value={key}>{val}</option>
          ))}
        </select>
      </div>

      {/* Pages Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--navy-500)] text-xs uppercase tracking-wider border-b border-[var(--glass-border)]">
                <th className="px-5 py-3">Pagină</th>
                <th className="px-5 py-3">Tip</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Autor</th>
                <th className="px-5 py-3">Actualizat</th>
                <th className="px-5 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-[var(--glass-hover)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="max-w-xs">
                      <p className="text-[var(--navy-200)] font-medium truncate">{page.title.replace(/ \|.*$/, "").replace(/ — .*$/, "")}</p>
                      <p className="text-xs text-[var(--navy-500)] mt-0.5">/{page.slug}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[var(--navy-400)]">{typeLabels[page.pageType]}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${statusLabels[page.status].class}`}>
                      {statusLabels[page.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[var(--navy-400)]">{page.authorName || "—"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[var(--navy-500)]">
                      {page.updatedContentAt ? new Date(page.updatedContentAt).toLocaleDateString("ro-RO") : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="p-2 rounded-lg hover:bg-[var(--navy-800)] text-[var(--navy-500)] hover:text-[var(--gold-400)] transition-colors"
                        title="Editează"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/analyzer/${page.id}`}
                        className="p-2 rounded-lg hover:bg-[var(--navy-800)] text-[var(--navy-500)] hover:text-emerald-400 transition-colors"
                        title="Analizează"
                      >
                        <BarChart className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-[var(--navy-800)] text-[var(--navy-500)] hover:text-blue-400 transition-colors"
                        title="Vizualizează"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPages.length === 0 && (
          <div className="px-5 py-12 text-center text-[var(--navy-500)]">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Nicio pagină găsită cu filtrele selectate.
          </div>
        )}
      </div>
    </div>
  );
}
