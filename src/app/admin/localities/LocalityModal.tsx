import { useState, useEffect } from "react";
import { X, Save, MapPin, AlertCircle } from "lucide-react";
import { Locality, LocalityType } from "@/types";
import { createLocality, updateLocality } from "@/lib/firestore";

interface LocalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  locality?: Locality | null;
}

export default function LocalityModal({ isOpen, onClose, onSaved, locality }: LocalityModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<Locality>>({
    name: "",
    slug: "",
    type: "CITY",
    countyName: "Brașov",
    population: 0,
    courtName: "",
    isActive: true,
  });

  useEffect(() => {
    if (locality) {
      setFormData(locality);
    } else {
      setFormData({
        name: "",
        slug: "",
        type: "CITY",
        countyName: "Brașov",
        population: 0,
        courtName: "",
        isActive: true,
      });
    }
    setError("");
  }, [locality, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (locality?.id) {
        await updateLocality(locality.id, formData);
      } else {
        await createLocality(formData as Omit<Locality, "id" | "createdAt" | "updatedAt">);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError("A apărut o eroare la salvarea localității.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass-card w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[var(--navy-950)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {locality ? "Editează Localitatea" : "Localitate Nouă"}
              </h2>
              <p className="text-sm text-[var(--navy-400)]">
                Gestionați acoperirea geografică SEO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-hover)] text-[var(--navy-400)] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form id="localityForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Nume Localitate</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: Făgăraș"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Tip</label>
                <select
                  value={formData.type || "CITY"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LocalityType })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                >
                  <option value="MUNICIPALITY">Municipiu</option>
                  <option value="CITY">Oraș</option>
                  <option value="COMMUNE">Comună</option>
                  <option value="VILLAGE">Sat</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Slug URL</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: fagaras"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Județ</label>
                <input
                  type="text"
                  value={formData.countyName || ""}
                  onChange={(e) => setFormData({ ...formData, countyName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Populație (Estimativă)</label>
                <input
                  type="number"
                  value={formData.population || ""}
                  onChange={(e) => setFormData({ ...formData, population: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Instanță Arondată</label>
                <input
                  type="text"
                  value={formData.courtName || ""}
                  onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: Judecătoria Făgăraș"
                />
              </div>

              <div className="col-span-2 flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--glass-border)] bg-[var(--navy-900)] text-[var(--gold-500)] focus:ring-[var(--gold-500)]/30"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-[var(--navy-200)] cursor-pointer">
                  Localitate Activă
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--glass-border)] bg-[var(--navy-900)]/50 rounded-b-2xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[var(--glass-border)] text-[var(--navy-200)] font-medium hover:bg-[var(--glass-hover)] hover:text-white transition-all"
          >
            Anulează
          </button>
          <button
            type="submit"
            form="localityForm"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-bold shadow-lg shadow-[var(--gold-500)]/20 hover:shadow-[var(--gold-500)]/40 hover:from-[var(--gold-400)] hover:to-[var(--gold-500)] transition-all disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[var(--navy-950)]/30 border-t-[var(--navy-950)] rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvează
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
