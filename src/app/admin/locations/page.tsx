"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, Plus, Pencil, Trash2, Globe, Phone, Mail, Clock, 
  ExternalLink, ChevronRight, LayoutGrid, List, Search
} from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteOfficeLocation } from "@/lib/firestore";
import type { OfficeLocation } from "@/types";
import OfficeLocationModal from "./OfficeLocationModal";

export default function LocationsPage() {
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<OfficeLocation | null>(null);

  useEffect(() => {
    const q = query(collection(db, "office_locations"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OfficeLocation[];
      setLocations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (location: OfficeLocation) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleDelete = async (location: OfficeLocation) => {
    if (window.confirm(`Sigur doriți să ștergeți sediul "${location.name}"?`)) {
      try {
        await deleteOfficeLocation(location.id);
      } catch (err) {
        console.error("Error deleting location:", err);
        alert("Eroare la ștergere.");
      }
    }
  };

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-[var(--stone-900)] rounded-lg"></div>
          <div className="h-10 w-40 bg-[var(--stone-900)] rounded-xl"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 premium-card border-dashed"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--stone-100)] uppercase tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-900)] border border-[var(--premium-border)] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[var(--gold-500)]" />
            </div>
            Sedii & Locații
          </h1>
          <p className="text-xs text-[var(--stone-500)] font-bold uppercase tracking-widest mt-2 ml-1">
            Gestionează prezența fizică a firmei în Brașov și împrejurimi
          </p>
        </div>
        <button
          onClick={() => { setSelectedLocation(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--gold-500)] text-[var(--stone-950)] font-bold text-sm hover:bg-[var(--gold-400)] transition-all shadow-xl shadow-[var(--gold-500)]/10"
        >
          <Plus className="w-4 h-4" />
          Adaugă Sediu Nou
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--stone-900)]/50 p-3 rounded-2xl border border-[var(--premium-border)]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--stone-600)]" />
          <input
            type="text"
            placeholder="Căutare sediu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[var(--gold-500)]/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 border border-[var(--premium-border)] rounded-xl p-1 bg-[var(--stone-950)]">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[var(--stone-900)] text-[var(--gold-500)]" : "text-[var(--stone-500)] hover:text-[var(--stone-300)]"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[var(--stone-900)] text-[var(--gold-500)]" : "text-[var(--stone-500)] hover:text-[var(--stone-300)]"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Locations Display */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc) => (
            <div key={loc.id} className="premium-card group overflow-hidden flex flex-col pt-6">
              <div className="px-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div>
                    <h3 className="text-lg font-bold text-[var(--stone-100)] group-hover:text-[var(--gold-500)] transition-colors">
                      {loc.name}
                    </h3>
                    <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[9px] font-bold tracking-widest uppercase border ${
                      loc.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {loc.isActive ? "Activ" : "Inactiv"}
                    </span>
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(loc)} className="p-2 rounded-lg bg-[var(--stone-950)] border border-[var(--premium-border)] hover:border-[var(--gold-500)]/50 text-[var(--stone-400)] hover:text-[var(--gold-500)]">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(loc)} className="p-2 rounded-lg bg-[var(--stone-950)] border border-[var(--premium-border)] hover:border-red-500/50 text-[var(--stone-400)] hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[var(--gold-500)] shrink-0 mt-0.5" />
                    <p className="text-xs text-[var(--stone-400)] line-clamp-2 leading-relaxed">{loc.address}, {loc.city}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[var(--stone-600)] shrink-0" />
                    <p className="text-xs text-[var(--stone-400)]">{loc.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[var(--stone-600)] shrink-0" />
                    <p className="text-xs text-[var(--stone-400)]">{loc.openingHours}</p>
                  </div>
                </div>

                {/* Map Preview Placeholder or Embed */}
                <div className="mt-auto mb-6 h-32 w-full rounded-xl bg-[var(--stone-950)] border border-[var(--premium-border)] overflow-hidden relative group/map">
                   {loc.googleMapsEmbedUrl ? (
                      <iframe
                        src={loc.googleMapsEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: "grayscale(1) invert(0.9) opacity(0.5)" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                   ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="w-8 h-8 text-[var(--stone-800)]" />
                      </div>
                   )}
                   <a 
                    href={loc.googleMapsLink} 
                    target="_blank" 
                    className="absolute inset-0 bg-black/0 group-hover/map:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover/map:opacity-100"
                   >
                      <button className="px-3 py-1.5 bg-[var(--gold-500)] text-[var(--stone-950)] text-[10px] font-bold rounded-lg flex items-center gap-2">
                        VEZI HARTĂ <ExternalLink className="w-3 h-3" />
                      </button>
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="premium-card overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-[var(--stone-950)] border-b border-[var(--premium-border)]">
                 <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest">Nume & Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest">Adresă</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest">Program</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest text-right">Acțiuni</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[var(--premium-border)]">
                 {filteredLocations.map(loc => (
                    <tr key={loc.id} className="hover:bg-[var(--premium-hover)] transition-colors group">
                       <td className="px-6 py-4">
                          <p className="font-bold text-[var(--stone-100)] text-sm">{loc.name}</p>
                          <span className={`text-[9px] font-bold tracking-widest uppercase ${loc.isActive ? "text-emerald-400" : "text-red-400"}`}>
                            {loc.isActive ? "Activ" : "Inactiv"}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-xs text-[var(--stone-400)]">{loc.address}</td>
                       <td className="px-6 py-4">
                          <p className="text-xs text-[var(--stone-200)]">{loc.phone}</p>
                          <p className="text-[10px] text-[var(--stone-500)]">{loc.email}</p>
                       </td>
                       <td className="px-6 py-4 text-xs text-[var(--stone-400)]">{loc.openingHours}</td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleEdit(loc)} className="p-2 rounded-lg hover:bg-[var(--stone-900)] text-[var(--stone-500)] hover:text-[var(--gold-500)] transition-colors">
                                <Pencil className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDelete(loc)} className="p-2 rounded-lg hover:bg-[var(--stone-900)] text-[var(--stone-500)] hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {filteredLocations.length === 0 && (
        <div className="premium-card p-12 text-center border-dashed border-2">
           <MapPin className="w-12 h-12 text-[var(--stone-800)] mx-auto mb-4" />
           <p className="text-sm font-bold text-[var(--stone-500)] uppercase tracking-[0.2em]">Niciun sediu găsit</p>
           <button 
             onClick={() => { setSelectedLocation(null); setIsModalOpen(true); }}
             className="mt-6 text-[10px] font-bold text-[var(--gold-500)] hover:text-[var(--stone-100)] transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-2 mx-auto"
           >
             <Plus className="w-4 h-4" /> Adaugă Primul Sediu
           </button>
        </div>
      )}

      <OfficeLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => setIsModalOpen(false)}
        location={selectedLocation}
      />
    </div>
  );
}
