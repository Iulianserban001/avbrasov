"use client";

import React from "react";
import Link from "next/link";
import { Scale, MapPin, Phone, Mail, Instagram, Linkedin, Facebook, ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/types";

interface FooterProps {
  settings: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] pt-24 pb-12 px-8 border-t border-white/5 overflow-hidden w-full flex flex-col items-center">
      
      {/* Background radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.06)_0%,_transparent_70%)] pointer-events-none opacity-40" />
  
      <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center">
        
        {/* Main Brand Section */}
        <div className="flex flex-col items-center text-center space-y-12 mb-24 max-w-4xl w-full">
          <Link href="/" className="group flex flex-col items-center justify-center text-center">
            {settings?.logoUrl ? (
               <img src={settings.logoUrl} alt={settings.firmName} className="h-16 w-auto mb-6 transition-transform group-hover:scale-105 duration-700" />
            ) : (
               <div className="flex flex-col items-center justify-center mb-6">
                  <span className="text-6xl md:text-7xl font-black tracking-tighter uppercase text-white italic leading-none block">SPS</span>
                  <span className="text-xs font-black tracking-[1em] uppercase text-[var(--gold-500)] mt-4 block">ȘI ASOCIAȚII</span>
               </div>
            )}
          </Link>
          
          <p className="text-xl md:text-2xl text-stone-400 font-serif italic leading-relaxed max-w-2xl mx-auto text-center px-6">
            "{settings?.firmDescription || "Definim standardele excelenței juridice prin rigoare academică, integritate morală și o viziune strategică de neegalat în apărarea dreptului."}"
          </p>
 
          <div className="flex items-center justify-center gap-10">
             {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)] transition-all duration-700 hover:scale-110 bg-white/5 shadow-xl"
                >
                   <Icon className="w-5 h-5" />
                </a>
             ))}
          </div>
        </div>
 
        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 w-full mb-24 text-center border-y border-white/5 py-20">
           
           <div className="flex flex-col items-center space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Portalul Elitei</h5>
              <div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">
                 <Link href="/" className="hover:text-white transition-colors">Acasă</Link>
                 <Link href="/blog" className="hover:text-white transition-colors">Journal Legislativ</Link>
                 <Link href="/contact" className="hover:text-white transition-colors">Consultanță</Link>
                 <Link href="/admin" className="hover:text-[var(--gold-500)] transition-colors opacity-20 hover:opacity-100">CMA Portal</Link>
              </div>
           </div>
 
           <div className="flex flex-col items-center space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Contact Direct</h5>
              <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
                 <div className="flex flex-col items-center gap-2">
                    <span className="text-stone-600 text-[8px]">TELEFON</span>
                    <span className="text-base tracking-widest">{settings?.firmPhone || "+40 700 000 000"}</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <span className="text-stone-600 text-[8px]">EMAIL</span>
                    <span className="text-base tracking-widest lowercase">{settings?.firmEmail || "office@sps-asociatii.ro"}</span>
                 </div>
              </div>
           </div>
 
           <div className="flex flex-col items-center space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Sediul Central</h5>
              <div className="text-stone-500 flex flex-col items-center gap-5">
                 <MapPin className="w-6 h-6 text-[var(--gold-600)]" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-[200px]">
                    {settings?.firmAddress || "Strada Republicii, Nr. 1, Brașov"}
                 </p>
              </div>
           </div>
 
        </div>
 
        {/* Legal & Copyright */}
        <div className="w-full flex flex-col items-center gap-10 text-center">
           <div className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-600">
              © {currentYear} {settings?.firmName || "SPS ȘI ASOCIAȚII"}. REZERVAT ELITEI JURIDICE. TOATE DREPTURILE REZERVATE.
           </div>
           
           <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.5em] text-stone-700 mb-8">
              <Link href="/politica-confidentialitate" className="hover:text-white transition-colors">Privată</Link>
              <Link href="/termeni-si-conditii" className="hover:text-white transition-colors">Termeni</Link>
           </div>
        </div>
 
      </div>

    </footer>
  );
}
