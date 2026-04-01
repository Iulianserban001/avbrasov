"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Upload, Image as ImageIcon, Shield, Globe, 
  Mail, Phone, MapPin, Facebook, Linkedin, Instagram,
  CheckCircle2, AlertCircle, Loader2, Trash2, Palette,
  Type, Share2, Zap, Target, Layout
} from "lucide-react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadBrandingAsset } from "@/lib/storage";
import type { SiteSettings } from "@/types";

const TABS = [
  { id: "branding", label: "Branding", icon: Palette },
  { id: "homepage", label: "Homepage", icon: Layout },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "social", label: "Social", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("branding");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // File Upload Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        } else {
          // Default initial settings
          const initial: SiteSettings = {
            firmName: "SPS și Asociații",
            firmPhone: "",
            firmEmail: "",
            firmAddress: "",
            firmCity: "Brașov",
            firmCounty: "Brașov",
            firmZipCode: "",
            firmLatitude: 45.6427,
            firmLongitude: 25.5887,
            firmDescription: "SPS și Asociații — Excelență în avocatură și consultanță juridică în Brașov.",
            metaTitleSuffix: "| SPS și Asociații",
            homeH1: "Justiție cu Prestigiu.",
            homeSubtitle: "Apărăm drepturile și interesele clienților noștri cu o rigoare academică și o strategie juridică de neegalat în județul Brașov.",
            ctaPrimary: "Programează Consultanță",
            ctaSecondary: "Vezi Expertiza Noastră"
          };
          setSettings(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleUpdate = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "hero") => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    try {
      setSaving(true);
      const path = `branding/${type}_${Date.now()}_${file.name}`;
      const url = await uploadBrandingAsset(file, path);
      
      if (type === "logo") handleUpdate("logoUrl", url);
      else handleUpdate("heroImageUrl", url);
      
      setStatus({ type: "success", msg: `${type === 'logo' ? 'Logoul' : 'Imaginea Hero'} a fost încărcată temporar. Salvează pentru a aplica.` });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Eroare la încărcare." });
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const docRef = doc(db, "settings", "global");
      await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() });
      setStatus({ type: "success", msg: "Setările au fost salvate cu succes!" });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Eroare la salvarea setărilor." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center h-[60vh]">
         <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-8 h-8 text-[var(--gold-500)] animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold-500)]">Se încarcă configurația</p>
         </div>
       </div>
     );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[var(--stone-100)] tracking-tighter uppercase italic">Setări Platformă</h1>
          <p className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.25em]">Configurare Branding & Infrastructură Digitală.</p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary flex items-center gap-2 px-8 min-w-[200px] justify-center disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Se salvează..." : "Salvează Modificări"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[var(--stone-900)] border border-[var(--premium-border)] rounded-2xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${activeTab === tab.id ? "bg-[var(--gold-500)] text-[var(--stone-950)] shadow-lg" : "text-[var(--stone-500)] hover:text-[var(--stone-100)]"}
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Alert */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              status.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-bold">{status.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          <AnimatePresence mode="wait">
            {activeTab === "branding" && (
              <motion.div
                key="branding"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                {/* Branding Form */}
                <div className="premium-card p-8 space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Nume Cabinet</label>
                        <input 
                          type="text" 
                          value={settings?.firmName} 
                          onChange={(e) => handleUpdate("firmName", e.target.value)}
                          className="input-pro"
                          placeholder="Cabinet de Avocatură..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Meta Title Suffix</label>
                        <input 
                          type="text" 
                          value={settings?.metaTitleSuffix} 
                          onChange={(e) => handleUpdate("metaTitleSuffix", e.target.value)}
                          className="input-pro"
                          placeholder="| Avocat Brașov"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Descriere Firmă (Footer/About)</label>
                      <textarea 
                        rows={4}
                        value={settings?.firmDescription} 
                        onChange={(e) => handleUpdate("firmDescription", e.target.value)}
                        className="input-pro resize-none"
                        placeholder="Expertiză juridică de top în Brașov..."
                      />
                   </div>
                </div>

                {/* LOGO & HERO SECTION */}
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="premium-card p-8 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                         <h3 className="text-xs font-black uppercase tracking-widest text-[var(--stone-100)] flex items-center gap-2">
                           <Type className="w-4 h-4 text-[var(--gold-500)]" /> Logo Site
                         </h3>
                         <button 
                           onClick={() => logoInputRef.current?.click()}
                           className="text-[10px] font-black uppercase tracking-widest text-[var(--gold-500)] hover:text-[var(--stone-100)] transition-colors"
                         >
                           Schimbă Imaginea
                         </button>
                      </div>
                      <div className="aspect-video rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden relative group">
                         {settings?.logoUrl ? (
                           <img src={settings.logoUrl} className="max-h-[80%] max-w-[80%] object-contain" alt="Logo" />
                         ) : (
                           <div className="flex flex-col items-center gap-2 text-[var(--stone-700)]">
                             <ImageIcon className="w-8 h-8" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">Niciun Logo</span>
                           </div>
                         )}
                         <input ref={logoInputRef} type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, "logo")} />
                      </div>
                   </div>

                   <div className="premium-card p-8 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                         <h3 className="text-xs font-black uppercase tracking-widest text-[var(--stone-100)] flex items-center gap-2">
                           <ImageIcon className="w-4 h-4 text-[var(--gold-500)]" /> Imagine Hero
                         </h3>
                         <button 
                           onClick={() => heroInputRef.current?.click()}
                           className="text-[10px] font-black uppercase tracking-widest text-[var(--gold-500)] hover:text-[var(--stone-100)] transition-colors"
                         >
                           Încarcă Nouă
                         </button>
                      </div>
                      <div className="aspect-video rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden relative group">
                         {settings?.heroImageUrl ? (
                           <img src={settings.heroImageUrl} className="w-full h-full object-cover" alt="Hero" />
                         ) : (
                           <div className="flex flex-col items-center gap-2 text-[var(--stone-700)]">
                             <ImageIcon className="w-8 h-8" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">Implicită</span>
                           </div>
                         )}
                         <input ref={heroInputRef} type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, "hero")} />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "homepage" && (
              <motion.div
                key="homepage"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div className="premium-card p-8 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Titlu Hero (H1)</label>
                      <input 
                        type="text" 
                        value={settings?.homeH1} 
                        onChange={(e) => handleUpdate("homeH1", e.target.value)}
                        className="input-pro text-xl font-serif italic"
                        placeholder="Justiție de Elită."
                      />
                      <p className="text-[9px] text-[var(--stone-600)] uppercase font-bold tracking-tight">Folosește spații pentru a separa cuvintele. Recomandat: 3-5 cuvinte.</p>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Subtitlu Hero</label>
                      <textarea 
                        rows={3}
                        value={settings?.homeSubtitle} 
                        onChange={(e) => handleUpdate("homeSubtitle", e.target.value)}
                        className="input-pro resize-none font-serif italic"
                        placeholder="Apărăm drepturile și interesele clienților noștri..."
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Meta Description (SEO)</label>
                      <textarea 
                        rows={2}
                        value={settings?.homeMetaDescription} 
                        onChange={(e) => handleUpdate("homeMetaDescription", e.target.value)}
                        className="input-pro resize-none"
                        placeholder="Cabinet de avocatură de elită în Brașov..."
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Cuvinte Cheie (SEO)</label>
                      <input 
                        type="text" 
                        value={settings?.homeKeywords} 
                        onChange={(e) => handleUpdate("homeKeywords", e.target.value)}
                        className="input-pro"
                        placeholder="avocat brasov, drept civil brasov..."
                      />
                   </div>
                   <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Buton Principal (CTA)</label>
                        <input 
                          type="text" 
                          value={settings?.ctaPrimary} 
                          onChange={(e) => handleUpdate("ctaPrimary", e.target.value)}
                          className="input-pro"
                          placeholder="Solicită Consultanță"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Buton Secundar (CTA)</label>
                        <input 
                          type="text" 
                          value={settings?.ctaSecondary} 
                          onChange={(e) => handleUpdate("ctaSecondary", e.target.value)}
                          className="input-pro"
                          placeholder="Explorați Expertiza"
                        />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="premium-card p-8 space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Telefon Principal
                      </label>
                      <input 
                        type="text" 
                        value={settings?.firmPhone} 
                        onChange={(e) => handleUpdate("firmPhone", e.target.value)}
                        className="input-pro"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email Contact
                      </label>
                      <input 
                        type="email" 
                        value={settings?.firmEmail} 
                        onChange={(e) => handleUpdate("firmEmail", e.target.value)}
                        className="input-pro"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] flex items-center gap-2">
                     <MapPin className="w-3 h-3" /> Adresă Sediu Central
                   </label>
                   <input 
                     type="text" 
                     value={settings?.firmAddress} 
                     onChange={(e) => handleUpdate("firmAddress", e.target.value)}
                     className="input-pro"
                     placeholder="Strada, Număr..."
                   />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Oraș</label>
                      <input type="text" value={settings?.firmCity} onChange={(e) => handleUpdate("firmCity", e.target.value)} className="input-pro" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Județ</label>
                      <input type="text" value={settings?.firmCounty} onChange={(e) => handleUpdate("firmCounty", e.target.value)} className="input-pro" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Cod Poștal</label>
                      <input type="text" value={settings?.firmZipCode} onChange={(e) => handleUpdate("firmZipCode", e.target.value)} className="input-pro" />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "social" && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="premium-card p-8 space-y-6"
              >
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] flex items-center gap-2">
                      <Facebook className="w-3 h-3" /> Facebook URL
                    </label>
                    <input type="text" value={settings?.socialFacebook} onChange={(e) => handleUpdate("socialFacebook", e.target.value)} className="input-pro" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] flex items-center gap-2">
                      <Linkedin className="w-3 h-3" /> LinkedIn URL
                    </label>
                    <input type="text" value={settings?.socialLinkedIn} onChange={(e) => handleUpdate("socialLinkedIn", e.target.value)} className="input-pro" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] flex items-center gap-2">
                      <Instagram className="w-3 h-3" /> Instagram URL
                    </label>
                    <input type="text" value={settings?.socialInstagram} onChange={(e) => handleUpdate("socialInstagram", e.target.value)} className="input-pro" />
                 </div>
                 <div className="pt-4 border-t border-[var(--premium-border)]">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] flex items-center gap-2 mb-2">
                      <Shield className="w-3 h-3" /> Google Maps Embed URL
                    </label>
                    <textarea value={settings?.googleMapsEmbed} onChange={(e) => handleUpdate("googleMapsEmbed", e.target.value)} className="input-pro h-24" placeholder="<iframe... />" />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="premium-card p-6 bg-gradient-to-br from-[var(--stone-900)] to-black border-l-4 border-l-[var(--gold-500)]">
              <div className="flex items-center gap-3 mb-4">
                 <Zap className="w-5 h-5 text-[var(--gold-500)]" />
                 <h3 className="text-xs font-black uppercase tracking-widest text-[var(--stone-100)]">Infrastructură Live</h3>
              </div>
              <p className="text-xs text-[var(--stone-500)] leading-relaxed italic">
                 "Brandingul dinamic permite cabinetului să reacționeze rapid la campanii sezoniere sau schimbări de identitate, fără intervenția echipei de development."
              </p>
           </div>

           <div className="premium-card p-6 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-100)] flex items-center gap-2">
                 <Target className="w-4 h-4 text-[var(--emerald-500)]" /> Status Optimizare
              </h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-[var(--stone-500)] uppercase">Branding</span>
                    <span className="text-emerald-400">ACTIV</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-[var(--stone-500)] uppercase">Contact</span>
                    <span className={settings?.firmPhone ? "text-emerald-400" : "text-amber-400"}>{settings?.firmPhone ? "COMPLET" : "INCOMPLET"}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-[var(--stone-500)] uppercase">SEO Suffix</span>
                    <span className="text-emerald-400">VALID</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
