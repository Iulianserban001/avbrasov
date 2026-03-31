"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Settings, Save, Upload, Trash2, Globe, Building2, 
  Smartphone, Mail, MapPin, Shield, Info, Image as ImageIcon,
  CheckCircle2, AlertCircle
} from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { uploadFile } from "@/lib/storage";
import type { SiteSettings } from "@/types";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState<SiteSettings>({
    firmName: "Avocat Brașov",
    firmPhone: "",
    firmEmail: "",
    firmAddress: "",
    firmCity: "Brașov",
    firmCounty: "Brașov",
    firmZipCode: "",
    firmLatitude: 45.6427,
    firmLongitude: 25.5887,
    firmDescription: "",
    metaTitleSuffix: "| Avocat Brașov",
    logoUrl: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSiteSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating settings:", err);
      alert("Eroare la salvarea setărilor.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const url = await uploadFile(file, `branding/logo_${Date.now()}_${file.name}`);
      setSettings(prev => ({ ...prev, logoUrl: url }));
    } catch (err) {
      console.error("Error uploading logo:", err);
      alert("Eroare la încărcarea logo-ului.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-10 w-64 bg-[var(--stone-900)] rounded-xl"></div>
        <div className="premium-card h-96 border-dashed"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--stone-100)] uppercase tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-[var(--stone-900)] border border-[var(--premium-border)] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[var(--gold-500)]" />
            </div>
            Setări Globale
          </h1>
          <p className="text-xs text-[var(--stone-500)] font-bold uppercase tracking-widest mt-2 ml-1">
            Configurarea brandului și informațiilor fundamentale ale firmei
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" /> Salvat cu succes
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--gold-500)] text-[var(--stone-950)] font-bold text-sm hover:bg-[var(--gold-400)] transition-all shadow-xl shadow-[var(--gold-500)]/10 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-[var(--stone-950)] border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Salvează Modificările
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Branding */}
        <div className="lg:col-span-1 space-y-6">
          <div className="premium-card p-6 space-y-6">
            <h3 className="text-xs font-bold text-[var(--gold-500)] uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Identitate Vizuală
            </h3>

            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest ml-1">Logo-ul Firmei</label>
              <div className="relative aspect-video w-full rounded-2xl bg-[var(--stone-950)] border border-[var(--premium-border)] flex flex-col items-center justify-center overflow-hidden group">
                {settings.logoUrl ? (
                  <>
                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-full bg-[var(--gold-500)] text-[var(--stone-950)] hover:scale-110 transition-transform"
                      >
                         <Upload className="w-4 h-4" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setSettings({ ...settings, logoUrl: "" })}
                        className="p-2 rounded-full bg-red-500 text-white hover:scale-110 transition-transform"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="w-10 h-10 text-[var(--stone-800)] mx-auto mb-2" />
                    <p className="text-[10px] text-[var(--stone-600)] font-bold uppercase tracking-wider">Click pentru upload</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Nume Firmă</label>
              <input
                type="text"
                value={settings.firmName}
                onChange={(e) => setSettings({ ...settings, firmName: e.target.value })}
                className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                placeholder="Avocat Brașov - Legal SEO"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Suffix Meta Title</label>
              <input
                type="text"
                value={settings.metaTitleSuffix}
                onChange={(e) => setSettings({ ...settings, metaTitleSuffix: e.target.value })}
                className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                placeholder="| Avocat Brașov"
              />
              <p className="text-[10px] text-[var(--stone-600)] mt-1.5 italic">Se va adăuga la sfârșitul fiecărui titlu de pagină.</p>
            </div>
          </div>

          <div className="premium-card p-6 bg-gradient-to-br from-[var(--gold-500)]/5 to-transparent">
             <div className="flex items-start gap-4">
                <Info className="w-5 h-5 text-[var(--gold-500)] shrink-0" />
                <div>
                   <h4 className="text-xs font-bold text-[var(--stone-100)] uppercase tracking-tight mb-1">Informație Live</h4>
                   <p className="text-[10px] text-[var(--stone-500)] leading-relaxed font-medium">
                      Modificările efectuate aici se vor reflecta instantaneu pe site-ul public în antet (Header) și subsol (Footer).
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Center & Right column: Details */}
        <div className="lg:col-span-2 space-y-6">
           <div className="premium-card p-8">
              <h3 className="text-xs font-bold text-[var(--gold-500)] uppercase tracking-widest flex items-center gap-2 mb-8">
                <Building2 className="w-3.5 h-3.5" /> Informații de Contact (Global Default)
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Adresă Principală (Sediul Head)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--stone-600)]" />
                        <input
                          type="text"
                          value={settings.firmAddress}
                          onChange={(e) => setSettings({ ...settings, firmAddress: e.target.value })}
                          className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Oraș</label>
                        <input
                          type="text"
                          value={settings.firmCity}
                          onChange={(e) => setSettings({ ...settings, firmCity: e.target.value })}
                          className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Județ</label>
                        <input
                          type="text"
                          value={settings.firmCounty}
                          onChange={(e) => setSettings({ ...settings, firmCounty: e.target.value })}
                          className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Descriere Firmă (Footer Brief)</label>
                      <textarea
                        rows={4}
                        value={settings.firmDescription}
                        onChange={(e) => setSettings({ ...settings, firmDescription: e.target.value })}
                        className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors resize-none"
                        placeholder="O scurtă descriere a misiunii firmei..."
                      />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Telefon Principal</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--stone-600)]" />
                        <input
                          type="text"
                          value={settings.firmPhone}
                          onChange={(e) => setSettings({ ...settings, firmPhone: e.target.value })}
                          className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[var(--stone-500)] uppercase tracking-widest mb-1.5 ml-1">Email Principal</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--stone-600)]" />
                        <input
                          type="email"
                          value={settings.firmEmail}
                          onChange={(e) => setSettings({ ...settings, firmEmail: e.target.value })}
                          className="w-full bg-[var(--stone-950)] border border-[var(--premium-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--gold-500)] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
                         <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                         <p className="text-[10px] text-[var(--stone-400)] leading-relaxed italic">
                           Aceste date vor fi folosite implicit pe paginile unde nu sunt specificate date de contact dedicate. Pentru locații multiple, folosiți modulul <span className="text-amber-500 font-bold uppercase tracking-widest text-[9px]">SEDII</span>.
                         </p>
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
