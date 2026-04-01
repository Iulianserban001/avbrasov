"use client";

import React from "react";
import Link from "next/link";
import { Scale, MapPin, Phone, Mail, Instagram, Linkedin, Facebook } from "lucide-react";
import type { SiteSettings } from "@/types";

interface FooterProps {
  settings: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black pt-40 pb-20 px-8 md:px-16 lg:px-24 border-t border-white/5 overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.05)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1920px] mx-auto flex flex-col items-center">
        
        {/* Main Brand Column - Top Center */}
        <div className="flex flex-col items-center text-center space-y-12 mb-32 max-w-2xl">
          <Link href="/" className="group flex flex-col items-center">
            {settings?.logoUrl ? (
               <img src={settings.logoUrl} alt={settings.firmName} className="h-12 w-auto mb-6" />
            ) : (
               <div className="flex flex-col items-center mb-6">
                  <span className="text-6xl font-black tracking-tighter uppercase text-white italic leading-none">SPS</span>
                  <span className="text-sm font-black tracking-[0.8em] uppercase text-[var(--gold-500)] mt-3">ȘI ASOCIAȚII</span>
               </div>
            )}
          </Link>
          
          <p className="text-stone-400 font-serif italic text-xl leading-relaxed">
            "{settings?.firmDescription || "Definim standardele excelenței juridice prin rigoare academică, integritate morală și o viziune strategică de neegalat în apărarea dreptului."}"
          </p>

          <div className="flex items-center gap-10">
             {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-stone-600 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)] transition-all duration-500 hover:scale-110">
                   <Icon className="w-5 h-5" />
                </a>
             ))}
          </div>
        </div>

        {/* Links & Contact Grid - Centered & Symmetrical */}
        <div className="grid md:grid-cols-3 gap-16 md:gap-32 w-full max-w-7xl border-y border-white/5 py-24 mb-24">
           
           <div className="flex flex-col items-center text-center space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Navigare Rapidă</h5>
              <div className="flex flex-col gap-5 text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">
                 <Link href="/" className="hover:text-white transition-colors">Acasă</Link>
                 <Link href="/blog" className="hover:text-white transition-colors">Journal Legislativ</Link>
                 <Link href="/contact" className="hover:text-white transition-colors">Contact Rapid</Link>
                 <Link href="/admin" className="hover:text-[var(--gold-500)] transition-colors opacity-40 hover:opacity-100">CMA Portal</Link>
              </div>
           </div>

           <div className="flex flex-col items-center text-center space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Contact Direct</h5>
              <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                 <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[var(--gold-600)]" />
                    <span>{settings?.firmPhone || "+40 700 000 000"}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[var(--gold-600)]" />
                    <span className="lowercase">{settings?.firmEmail || "office@sps-asociatii.ro"}</span>
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-center text-center space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Sediul Central</h5>
              <div className="flex items-center gap-4 text-stone-500 max-w-xs justify-center">
                 <MapPin className="w-6 h-6 text-[var(--gold-600)] shrink-0" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                    {settings?.firmAddress || "Str. Republicii, Nr. 1, Brașov"}
                 </p>
              </div>
           </div>

        </div>

        {/* Legal & Copyright */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-10 mt-10">
           <div className="text-[9px] font-black uppercase tracking-[0.5em] text-stone-600 py-1 px-4 border border-white/5 rounded-full">
              © {currentYear} SPS ȘI ASOCIAȚII. TOATE DREPTURILE REZERVATE.
           </div>
           
           <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-stone-700">
              <Link href="/politica-confidentialitate" className="hover:text-white transition-colors">Politica Privată</Link>
              <Link href="/termeni-si-conditii" className="hover:text-white transition-colors">Termeni Legali</Link>
           </div>
        </div>

      </div>

    </footer>
  );
}
