"use client";

import { useState, useEffect } from "react";
import {
  Scale, Plus, Pencil, ExternalLink, GripVertical,
  ChevronRight, ToggleLeft, ToggleRight, Search as SearchIcon,
  Trash2, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { getServices, getPages, updateService, deleteService } from "@/lib/firestore";
import { LegalService, Page } from "@/types";
import ServiceModal from "./ServiceModal";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<LegalService[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<LegalService | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedServices, fetchedPages] = await Promise.all([
        getServices(),
        getPages()
      ]);
      setServices(fetchedServices);
      setPages(fetchedPages);
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (service: LegalService) => {
    try {
      await updateService(service.id, { isActive: !service.isActive });
      loadData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Sigur doriți să ștergeți acest serviciu? Toate paginile asociate ar putea fi afectate.")) {
      try {
        await deleteService(id);
        loadData();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Servicii Juridice</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            {services.length} servicii totale • Gestionați ariile de practică
          </p>
        </div>
        <button 
          onClick={() => { setEditingService(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--gold-500)]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Serviciu Nou
        </button>
      </div>

      <div className="glass-card p-3">
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--navy-500)]" />
          <input
            type="text"
            placeholder="Căutați un serviciu juridic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--navy-850)] border border-[var(--glass-border)] text-sm text-[var(--navy-200)] placeholder:text-[var(--navy-600)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-500)]/30"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-[var(--navy-800)] border-t-[var(--gold-500)] rounded-full animate-spin" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-[var(--navy-400)]">
             <AlertTriangle className="w-12 h-12 mb-4 text-[var(--navy-600)]" />
             <p>Niciun serviciu găsit. Adăugați unul nou.</p>
          </div>
        ) : (
          filteredServices.map((service, index) => {
            const pageCount = pages.filter((p) => p.serviceId === service.id).length;
            const publishedCount = pages.filter(
              (p) => p.serviceId === service.id && p.status === "PUBLISHED"
            ).length;

            return (
              <div
                key={service.id}
                className="glass-card p-5 flex items-start gap-4 group animate-fade-in-up hover:border-[var(--gold-500)]/20 transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 text-[var(--navy-600)] cursor-grab">
                  <GripVertical className="w-4 h-4" />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold-500)]/20 to-[var(--gold-600)]/10 border border-[var(--gold-500)]/20 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-[var(--gold-400)]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-[var(--gold-400)] transition-colors">
                      {service.name}
                    </h3>
                    {service.isActive ? (
                      <span className="badge bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        ACTIV
                      </span>
                    ) : (
                      <span className="badge bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                        INACTIV
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--navy-400)] mt-1 line-clamp-2">
                    {service.description || "Fără descriere"}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--navy-500)]">
                    <span>/{service.slug}</span>
                    <span className="w-px h-3 bg-[var(--glass-border)]" />
                    <span>{pageCount} pagini ({publishedCount} publicate)</span>
                    <span className="w-px h-3 bg-[var(--glass-border)]" />
                    <span>Ordine: {service.sortOrder}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingService(service); setIsModalOpen(true); }}
                    className="p-2 rounded-lg hover:bg-[var(--glass-hover)] text-[var(--navy-400)] hover:text-white transition-colors"
                    title="Editează"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/servicii/${service.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg hover:bg-[var(--glass-hover)] text-[var(--navy-400)] hover:text-white transition-colors"
                    title="Vezi pe site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleToggleActive(service)}
                    className="p-2 rounded-lg hover:bg-[var(--glass-hover)] text-[var(--navy-400)] hover:text-white transition-colors"
                    title={service.isActive ? "Dezactivează" : "Activează"}
                  >
                    {service.isActive ? (
                      <ToggleRight className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-red-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--navy-400)] hover:text-red-400 transition-colors ml-2 border-l border-[var(--glass-border)] pl-4"
                    title="Șterge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-[var(--navy-200)] mb-2">Câmpuri Template Serviciu</h3>
        <p className="text-xs text-[var(--navy-500)]">
          Fiecare serviciu poate avea câmpuri template (eligibilitate, proces, documente necesare, termene, costuri)
          care sunt precompletate automat la generarea paginilor de localitate, asigurând consistența și calitatea minimă.
        </p>
      </div>

      <ServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={loadData}
        service={editingService}
      />
    </div>
  );
}
