"use client";

import { useState, useEffect } from "react";
import { X, Save, MapPin, Phone, Mail, Clock, Globe, ArrowUpRight } from "lucide-react";
import { createOfficeLocation, updateOfficeLocation } from "@/lib/firestore";
import type { OfficeLocation } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  location: OfficeLocation | null;
}

export default function OfficeLocationModal({ isOpen, onClose, onSaved, location }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "Brașov",
    phone: "",
    email: "",
    googleMapsEmbedUrl: "",
    googleMapsLink: "",
    openingHours: "Luni - Vineri: 09:00 - 18:00",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || "",
        address: location.address || "",
        city: location.city || "Brașov",
        phone: location.phone || "",
        email: location.email || "",
        googleMapsEmbedUrl: location.googleMapsEmbedUrl || "",
        googleMapsLink: location.googleMapsLink || "",
        openingHours: location.openingHours || "Luni - Vineri: 09:00 - 18:00",
        order: location.order || 0,
        isActive: location.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        address: "",
        city: "Brașov",
        phone: "",
        email: "",
        googleMapsEmbedUrl: "",
        googleMapsLink: "",
        openingHours: "Luni - Vineri: 09:00 - 18:00",
        order: 0,
        isActive: true,
      });
    }
  }, [location, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (location) {
        await updateOfficeLocation(location.id, formData);
      } else {
        await createOfficeLocation(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error("Error saving office location:", err);
      alert("Eroare la salvarea locației.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--stone-900)] border border-[var(--premium-border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--premium-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold-500)]/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[var(--gold-500)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--stone-100)] uppercase tracking-tight">
                {location ? "Editează Locația" : "Locație Nouă"}
              </h2>
              <p className="text-xs text-[var(--stone-500)] uppercase tracking-widest font-bold">Sediu Physical Office</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--premium-hover)] rounded-full transition-colors text-[var(--stone-500)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Nume Sediu</label>
                <input
                  type="text"
                  required
                  placeholder="EX: Sediul Central Brașov"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Adresă Completă</label>
                <input
                  type="text"
                  required
                  placeholder="Strada, Număr, Bloc..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Oraș</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Ordine (Sort)</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--stone-600)]" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--stone-600)]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Program</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--stone-600)]" />
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--premium-border)]">
            <h3 className="text-xs font-bold text-[var(--gold-500)] uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Integration Google Maps
            </h3>
            
            <div>
              <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Google Maps Embed URL</label>
              <input
                type="text"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={formData.googleMapsEmbedUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsEmbedUrl: e.target.value })}
                className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--gold-500)] transition-colors font-mono"
              />
              <p className="text-[10px] text-[var(--stone-600)] mt-1.5 italic">Copiați link-ul din Google Maps (Share {"->"} Embed map {"->"} src url)</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Google Maps Direct Link</label>
              <input
                type="text"
                placeholder="https://maps.app.goo.gl/..."
                value={formData.googleMapsLink}
                onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--gold-500)] transition-colors font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-[var(--premium-border)] bg-[var(--stone-950)] text-[var(--gold-500)] focus:ring-0"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-[var(--stone-200)]">Locație Activă (Vizibilă pe site)</label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--premium-border)] flex justify-end gap-3 bg-[var(--stone-950)]">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-bold text-[var(--stone-400)] hover:bg-[var(--premium-hover)] transition-colors"
          >
            Anulează
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2 rounded-xl bg-[var(--gold-500)] text-[var(--stone-950)] font-bold text-sm hover:bg-[var(--gold-400)] transition-colors disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-[var(--stone-950)] border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {location ? "Salvează Modificările" : "Creează Locația"}
          </button>
        </div>
      </div>
    </div>
  );
}
