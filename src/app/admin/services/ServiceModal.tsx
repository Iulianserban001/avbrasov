import { useState, useEffect } from "react";
import { X, Save, Scale, AlertCircle } from "lucide-react";
import { LegalService } from "@/types";
import { createService, updateService } from "@/lib/firestore";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  service?: LegalService | null;
}

export default function ServiceModal({ isOpen, onClose, onSaved, service }: ServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<LegalService>>({
    name: "",
    slug: "",
    description: "",
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        isActive: true,
        sortOrder: 0,
      });
    }
    setError("");
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (service?.id) {
        await updateService(service.id, formData);
      } else {
        await createService(formData as Omit<LegalService, "id" | "createdAt" | "updatedAt">);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError("A apărut o eroare la salvarea serviciului.");
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
              <Scale className="w-5 h-5 text-[var(--navy-950)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {service ? "Editează Serviciul" : "Serviciu Nou"}
              </h2>
              <p className="text-sm text-[var(--navy-400)]">
                Gestionați detaliile ariei de practică
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

          <form id="serviceForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Nume Serviciu</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: Drept Penal"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: drept-penal"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Descriere Scurtă</label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="Apare în listări și carduri..."
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Ordine Afișare</label>
                <input
                  type="number"
                  value={formData.sortOrder || 0}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
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
                  Serviciu Activ (Apare pe site)
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
            form="serviceForm"
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
