"use client";

import { useState, useEffect } from "react";
import {
  MapPin, Plus, Pencil, Eye, Search as SearchIcon,
  Building2, Users, Landmark, Globe, Trash2
} from "lucide-react";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteLocality } from "@/lib/firestore";
import type { Locality, LocalityType } from "@/types";
import LocalityModal from "./LocalityModal";

const typeColors: Record<LocalityType, string> = {
  MUNICIPALITY: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  CITY: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  COMMUNE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  VILLAGE: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const typeLabels: Record<LocalityType, string> = {
  MUNICIPALITY: "Municipiu",
  CITY: "Oras",
  COMMUNE: "Comuna",
  VILLAGE: "Sat",
};

const typeIcons: Record<LocalityType, React.ElementType> = {
  MUNICIPALITY: Building2,
  CITY: Landmark,
  COMMUNE: Globe,
  VILLAGE: MapPin,
};

export default function LocalitiesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null);

  useEffect(() => {
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));
    
    const q = query(
      collection(db, "localities"),
      orderBy("name", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const locData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Locality[];
      
      await minLoadTime;
      setLocalities(locData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (locality: Locality) => {
    setSelectedLocality(locality);
    setIsModalOpen(true);
  };

  const handleDelete = async (locality: Locality) => {
    if (window.confirm(`Sunteți sigur că doriți să ștergeți localitatea "${locality.name}"?`)) {
      try {
        await deleteLocality(locality.id);
      } catch (err) {
        console.error("Eroare la ștergerea localității", err);
        alert("A apărut o eroare la ștergere.");
      }
    }
  };

  const filteredLocalities = localities.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || l.type === typeFilter;
    return matchSearch && matchType;
  });

  const typeCounts = {
    MUNICIPALITY: localities.filter((l) => l.type === "MUNICIPALITY").length,
    CITY: localities.filter((l) => l.type === "CITY").length,
    COMMUNE: localities.filter((l) => l.type === "COMMUNE").length,
    VILLAGE: localities.filter((l) => l.type === "VILLAGE").length,
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-[var(--navy-800)] rounded-xl w-64"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 glass-card"></div>)}
        </div>
        <div className="glass-card h-12"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="glass-card h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Localități</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            {localities.length} localități din județul Brașov • Acoperire geografică SEO
          </p>
        </div>
        <button 
          onClick={() => { setSelectedLocality(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--gold-500)]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Localitate Nouă
        </button>
      </div>

      {/* Type Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.entries(typeCounts) as [LocalityType, number][]).map(([type, count]) => {
          const Icon = typeIcons[type];
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
              className={`glass-card p-4 flex items-center gap-3 transition-all ${
                typeFilter === type ? "border-[var(--gold-500)]/40 bg-[var(--gold-500)]/5" : ""
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeColors[type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-white">{count}</p>
                <p className="text-xs text-[var(--navy-500)]">{typeLabels[type]}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="glass-card p-3">
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--navy-500)]" />
          <input
            type="text"
            placeholder="Căutați o localitate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--navy-850)] border border-[var(--glass-border)] text-sm text-[var(--navy-200)] placeholder:text-[var(--navy-600)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-500)]/30"
          />
        </div>
      </div>

      {/* Localities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocalities.map((locality, index) => {
          const Icon = typeIcons[locality.type];

          return (
            <div
              key={locality.id}
              className={`glass-card p-5 group hover:border-[var(--gold-500)]/20 transition-all animate-fade-in-up ${
                !locality.isActive ? "opacity-60 grayscale-[50%]" : ""
              }`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[locality.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-[var(--gold-400)] transition-colors">
                      {locality.name} {locality.isActive ? "" : "(Inactiv)"}
                    </h3>
                    <span className={`badge text-[10px] mt-1 ${typeColors[locality.type]}`}>
                      {typeLabels[locality.type]}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(locality)}
                    className="p-1.5 rounded-md hover:bg-[var(--glass-hover)] text-[var(--navy-400)] hover:text-white"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(locality)}
                    className="p-1.5 rounded-md hover:bg-red-500/20 text-[var(--navy-400)] hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[var(--navy-400)]">
                {locality.courtName && (
                  <div className="flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-[var(--navy-500)]" />
                    <span>{locality.courtName}</span>
                  </div>
                )}
                {locality.population && (
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[var(--navy-500)]" />
                    <span>{locality.population.toLocaleString()} locuitori</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--navy-500)]" />
                  <span>{locality.countyName || "Brasov"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLocalities.length === 0 && (
        <div className="glass-card p-12 text-center">
          <MapPin className="w-10 h-10 text-[var(--navy-600)] mx-auto mb-3" />
          <p className="text-[var(--navy-400)]">Nicio localitate găsită.</p>
        </div>
      )}

      {isModalOpen && (
        <LocalityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => setIsModalOpen(false)}
          locality={selectedLocality}
        />
      )}
    </div>
  );
}
