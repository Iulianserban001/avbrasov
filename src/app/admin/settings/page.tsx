"use client";

import { useState, useEffect } from "react";
import {
  Building2, Phone, Mail, Globe, Share2, Save, CheckCircle
} from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import type { SiteSettings } from "@/types";

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const sections: SettingsSection[] = [
  { id: "firm", label: "Cabinet", icon: Building2 },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "seo", label: "SEO Global", icon: Globe },
  { id: "social", label: "Social Media", icon: Share2 },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("firm");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({
    firmName: "",
    firmPhone: "",
    firmEmail: "",
    firmAddress: "",
    firmCity: "",
    firmCounty: "",
    firmZipCode: "",
    firmLatitude: 0,
    firmLongitude: 0,
    firmDescription: "",
    socialFacebook: "",
    socialLinkedIn: "",
    socialInstagram: "",
    googleMapsEmbed: "",
    metaTitleSuffix: "",
    defaultOgImage: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));
        const data = await getSiteSettings();
        await minLoadTime;

        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Eroare la încărcarea setărilor", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Eroare la salvarea setărilor", err);
      alert("A apărut o eroare la salvarea setărilor.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof SiteSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-[var(--navy-850)] border border-[var(--glass-border)] text-sm text-[var(--navy-200)] placeholder:text-[var(--navy-600)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-500)]/30 transition-colors";
  const labelClass = "text-xs font-medium text-[var(--navy-400)] mb-1.5 block";

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-[var(--navy-800)] rounded-xl w-64"></div>
        <div className="grid lg:grid-cols-[250px_1fr] gap-6">
          <div className="glass-card h-40"></div>
          <div className="glass-card h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Setări Globale</h1>
          <p className="text-sm text-[var(--navy-400)] mt-1">
            Configurați datele firmei, SEO și integrări Social Media
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--gold-500)]/20 transition-all disabled:opacity-70"
        >
          {saving ? (
             <div className="w-5 h-5 border-2 border-[var(--navy-950)]/30 border-t-[var(--navy-950)] rounded-full animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Salvat!" : "Salvează"}
        </button>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-6">
        {/* Section Nav */}
        <div className="glass-card p-2 h-fit">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                activeSection === section.id
                  ? "bg-[var(--gold-500)]/10 text-[var(--gold-400)]"
                  : "text-[var(--navy-400)] hover:text-[var(--navy-200)] hover:bg-[var(--glass-hover)]"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="glass-card p-6 space-y-6">
          {activeSection === "firm" && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-4">Informații Cabinet</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Nume Cabinet</label>
                  <input type="text" className={inputClass} value={settings.firmName || ""} onChange={(e) => updateField("firmName", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Descriere / Slogan scurt</label>
                  <input type="text" className={inputClass} value={settings.firmDescription || ""} onChange={(e) => updateField("firmDescription", e.target.value)} />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Adresa</label>
                  <input type="text" className={inputClass} value={settings.firmAddress || ""} onChange={(e) => updateField("firmAddress", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Oraș</label>
                  <input type="text" className={inputClass} value={settings.firmCity || ""} onChange={(e) => updateField("firmCity", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Județ</label>
                  <input type="text" className={inputClass} value={settings.firmCounty || ""} onChange={(e) => updateField("firmCounty", e.target.value)} />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 border-t border-[var(--glass-border)] pt-4 mt-4">
                <div>
                  <label className={labelClass}>Cod Poștal</label>
                  <input type="text" className={inputClass} value={settings.firmZipCode || ""} onChange={(e) => updateField("firmZipCode", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Latitudine Geografică</label>
                  <input type="number" step="0.0001" className={inputClass} value={settings.firmLatitude || 0} onChange={(e) => updateField("firmLatitude", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={labelClass}>Longitudine Geografică</label>
                  <input type="number" step="0.0001" className={inputClass} value={settings.firmLongitude || 0} onChange={(e) => updateField("firmLongitude", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </div>
          )}

          {activeSection === "contact" && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-4">Informații Contact</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Telefon Principal</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--navy-500)]" />
                    <input type="text" className={`${inputClass} pl-10`} value={settings.firmPhone || ""} onChange={(e) => updateField("firmPhone", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email Principal</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--navy-500)]" />
                    <input type="text" className={`${inputClass} pl-10`} value={settings.firmEmail || ""} onChange={(e) => updateField("firmEmail", e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="border-t border-[var(--glass-border)] pt-4 mt-4">
                <label className={labelClass}>Google Maps Embed URL</label>
                <input type="text" className={inputClass} value={settings.googleMapsEmbed || ""} onChange={(e) => updateField("googleMapsEmbed", e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
              </div>
            </div>
          )}

          {activeSection === "seo" && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-4">SEO Global</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Sufix Titlu Meta (toate paginile)</label>
                  <input type="text" className={inputClass} value={settings.metaTitleSuffix || ""} onChange={(e) => updateField("metaTitleSuffix", e.target.value)} />
                  <p className="text-xs text-[var(--navy-600)] mt-1">Se adaugă automat la sfârșitul fiecărui titlu</p>
                </div>
                <div>
                  <label className={labelClass}>Imagine OG Default (URL)</label>
                  <input type="text" className={inputClass} value={settings.defaultOgImage || ""} onChange={(e) => updateField("defaultOgImage", e.target.value)} />
                </div>
              </div>
              
              <div className="glass-card p-4 bg-[var(--navy-900)] mt-6">
                <h3 className="text-sm font-medium text-[var(--navy-300)] mb-2">Previzualizare Google Search</h3>
                <div className="space-y-1">
                  <p className="text-blue-400 text-base hover:underline cursor-pointer">
                    Avocat Consultanță{settings.metaTitleSuffix || " | Avocat Brașov"}
                  </p>
                  <p className="text-emerald-400 text-xs">avocatbrasov.ro</p>
                  <p className="text-sm text-[var(--navy-400)] line-clamp-2 mt-1">
                    {settings.firmDescription || "Scurtă descriere a serviciilor pentru snippet-ul de căutare Google, optimizată pentru CTR și relevanță."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "social" && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-4">Rețele Sociale</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Facebook Page URL</label>
                  <input type="text" className={inputClass} value={settings.socialFacebook || ""} onChange={(e) => updateField("socialFacebook", e.target.value)} placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input type="text" className={inputClass} value={settings.socialLinkedIn || ""} onChange={(e) => updateField("socialLinkedIn", e.target.value)} placeholder="https://linkedin.com/company/..." />
                </div>
                <div>
                  <label className={labelClass}>Instagram URL</label>
                  <input type="text" className={inputClass} value={settings.socialInstagram || ""} onChange={(e) => updateField("socialInstagram", e.target.value)} placeholder="https://instagram.com/..." />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
