import { useState, useEffect } from "react";
import { X, Save, Shield, AlertCircle } from "lucide-react";
import { UserProfile, UserRole } from "@/types";
import { createUserProfile, updateUserProfile } from "@/lib/firestore";

interface AttorneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  attorney?: UserProfile | null;
}

export default function AttorneyModal({ isOpen, onClose, onSaved, attorney }: AttorneyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    email: "",
    role: "EDITOR",
    bio: "",
    barMembership: "",
    credentials: "",
    practiceAreas: [],
    yearsExp: 0,
    isActive: true,
  });

  const [practicesString, setPracticesString] = useState("");

  useEffect(() => {
    if (attorney) {
      setFormData(attorney);
      setPracticesString(attorney.practiceAreas?.join(", ") || "");
    } else {
      setFormData({
        name: "",
        email: "",
        role: "EDITOR",
        bio: "",
        barMembership: "",
        credentials: "",
        practiceAreas: [],
        yearsExp: 0,
        isActive: true,
      });
      setPracticesString("");
    }
    setError("");
  }, [attorney, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        practiceAreas: practicesString.split(",").map((s) => s.trim()).filter(Boolean),
      };

      if (attorney?.id) {
        await updateUserProfile(attorney.id, payload);
      } else {
        await createUserProfile(payload as Omit<UserProfile, "id" | "createdAt" | "updatedAt">);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError("A apărut o eroare la salvarea profilului.");
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
              <Shield className="w-5 h-5 text-[var(--navy-950)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {attorney ? "Editează Profil" : "Profil Nou E-E-A-T"}
              </h2>
              <p className="text-sm text-[var(--navy-400)]">
                Completați datele pentru a crește încrederea Google (E-E-A-T)
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

          <form id="attorneyForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Nume Complet</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: Av. Iulian Șerban"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Email (pentru Login viitor)</label>
                <input
                  type="email"
                  required
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Rol Platformă</label>
                <select
                  value={formData.role || "EDITOR"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                >
                  <option value="OWNER">Proprietar</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="LEGAL_REVIEWER">Reviewer Juridic</option>
                  <option value="EDITOR">Editor Conținut</option>
                  <option value="SEO_ANALYST">Analist SEO</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Ani Experiență</label>
                <input
                  type="number"
                  value={formData.yearsExp || ""}
                  onChange={(e) => setFormData({ ...formData, yearsExp: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Scurtă Descriere (Bio)</label>
                <textarea
                  rows={2}
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="Bio utilizat pentru paginile de autori și review-ul articolelor E-E-A-T..."
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Baroul de Apartenență</label>
                <input
                  type="text"
                  value={formData.barMembership || ""}
                  onChange={(e) => setFormData({ ...formData, barMembership: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: Baroul Brașov"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Credențiale / Educație</label>
                <input
                  type="text"
                  value={formData.credentials || ""}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: Facultatea de Drept București"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">Arii de Practică (Despărțite prin virgulă)</label>
                <input
                  type="text"
                  value={practicesString}
                  onChange={(e) => setPracticesString(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                  placeholder="ex: Drept Penal, Drept Civil, Dreptul Familiei"
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
                  Membru Activ
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
            form="attorneyForm"
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
