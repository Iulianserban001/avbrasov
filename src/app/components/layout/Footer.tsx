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
    <footer className="relative bg-[#050505] pt-40 pb-20 px-8 md:px-16 lg:px-24 border-t border-white/5 overflow-hidden w-full">
      
      {/* Background radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.08)_0%,_transparent_70%)] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center w-full">
        
        {/* Main Brand Section */}
        <div className="flex flex-col items-center text-center space-y-16 mb-40 max-w-4xl w-full">
          <Link href="/" className="group flex flex-col items-center justify-center text-center">
            {settings?.logoUrl ? (
               <img src={settings.logoUrl} alt={settings.firmName} className="h-20 w-auto mb-8 transition-transform group-hover:scale-105 duration-700" />
            ) : (
               <div className="flex flex-col items-center justify-center mb-8">
                  <span className="text-7xl md:text-8xl font-black tracking-tighter uppercase text-white italic leading-none block">SPS</span>
                  <span className="text-sm md:text-base font-black tracking-[1em] uppercase text-[var(--gold-500)] mt-6 block">ȘI ASOCIAȚII</span>
               </div>
            )}
          </Link>
          
          <p className="text-2xl md:text-3xl text-stone-400 font-serif italic leading-relaxed max-w-3xl mx-auto text-center">
            "{settings?.firmDescription || "Definim standardele excelenței juridice prin rigoare academică, integritate morală și o viziune strategică de neegalat în apărarea dreptului."}"
          </p>

          <div className="flex items-center justify-center gap-12">
             {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)] transition-all duration-700 hover:scale-125 bg-white/5 shadow-2xl"
                >
                   <Icon className="w-6 h-6" />
                </a>
             ))}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-40 w-full mb-40 text-center border-y border-white/5 py-32">
           
           <div className="flex flex-col items-center space-y-10">
              <h5 className="text-[12px] font-black uppercase tracking-[0.6em] text-white">Portalul Elitei</h5>
              <div className="flex flex-col gap-6 text-[11px] font-black uppercase tracking-[0.4em] text-stone-500">
                 <Link href="/" className="hover:text-white transition-colors">Acasă</Link>
                 <Link href="/blog" className="hover:text-white transition-colors">Journal Legislativ</Link>
                 <Link href="/contact" className="hover:text-white transition-colors">Consultanță</Link>
                 <Link href="/admin" className="hover:text-[var(--gold-500)] transition-colors opacity-20 hover:opacity-100">CMA Portal</Link>
              </div>
           </div>

           <div className="flex flex-col items-center space-y-10">
              <h5 className="text-[12px] font-black uppercase tracking-[0.6em] text-white">Contact Direct</h5>
              <div className="flex flex-col gap-8 text-[11px] font-black uppercase tracking-[0.4em] text-stone-300">
                 <div className="flex flex-col items-center gap-3">
                    <span className="text-stone-600 text-[9px]">TELEFON</span>
                    <span className="text-lg tracking-widest">{settings?.firmPhone || "+40 700 000 000"}</span>
                 </div>
                 <div className="flex flex-col items-center gap-3">
                    <span className="text-stone-600 text-[9px]">EMAIL</span>
                    <span className="text-lg tracking-widest lowercase">{settings?.firmEmail || "office@sps-asociatii.ro"}</span>
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-center space-y-10">
              <h5 className="text-[12px] font-black uppercase tracking-[0.6em] text-white">Sediul Central</h5>
              <div className="text-stone-500 flex flex-col items-center gap-6">
                 <MapPin className="w-8 h-8 text-[var(--gold-600)]" />
                 <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-[250px]">
                    {settings?.firmAddress || "Strada Republicii, Nr. 1, Brașov"}
                 </p>
              </div>
           </div>

        </div>

        {/* Legal & Copyright */}
        <div className="w-full flex flex-col items-center gap-12 text-center pt-10">
           <div className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-600">
              © {currentYear} {settings?.firmName || "SPS ȘI ASOCIAȚII"}. REZERVAT ELITEI JURIDICE. TOATE DREPTURILE REZERVATE.
           </div>
           
           <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.5em] text-stone-700">
              <Link href="/politica-confidentialitate" className="hover:text-white transition-colors">Privată</Link>
              <Link href="/termeni-si-conditii" className="hover:text-white transition-colors">Termeni</Link>
           </div>
        </div>

      </div>

    </footer>
  );
}
