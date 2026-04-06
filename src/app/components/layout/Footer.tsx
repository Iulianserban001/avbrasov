"use client";

import React from "react";
import Link from "next/link";
import { Scale, MapPin, Phone, Mail, Instagram, Linkedin, Facebook, ArrowRight, ExternalLink } from "lucide-react";
import type { SiteSettings, OfficeLocation } from "@/types";

interface FooterProps {
  settings: SiteSettings | null;
  locations?: OfficeLocation[];
}

export default function Footer({ settings, locations = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const activeLocations = locations.filter(loc => loc.isActive);

  return (
    <footer className="relative bg-[#050505] pt-24 pb-12 px-8 border-t border-white/5 overflow-hidden w-full flex flex-col items-center">
      
      {/* Background radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.06)_0%,_transparent_70%)] pointer-events-none opacity-40" />
  
      <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center relative z-10">
        
        {/* Main Brand Section */}
        <div className="flex flex-col items-center text-center space-y-12 mb-20 max-w-4xl w-full">
          <Link href="/" className="group flex flex-col items-center justify-center text-center">
            {settings?.logoUrl ? (
               <img src={settings.logoUrl} alt={settings.firmName || "SPS"} className="h-16 w-auto mb-6 transition-transform group-hover:scale-105 duration-700" />
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
 
          <div className="flex items-center justify-center gap-6 md:gap-10 mt-8">
             {settings?.socialFacebook && (
               <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)] transition-all duration-700 hover:scale-110 bg-white/5 shadow-xl">
                 <Facebook className="w-5 h-5" />
               </a>
             )}
             {settings?.socialInstagram && (
               <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)] transition-all duration-700 hover:scale-110 bg-white/5 shadow-xl">
                 <Instagram className="w-5 h-5" />
               </a>
             )}
             {settings?.socialLinkedIn && (
               <a href={settings.socialLinkedIn} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-[var(--gold-500)] hover:border-[var(--gold-500)] transition-all duration-700 hover:scale-110 bg-white/5 shadow-xl">
                 <Linkedin className="w-5 h-5" />
               </a>
             )}
          </div>
        </div>
 
        {/* Footer Navigation Columns */}
        <div className={`grid grid-cols-1 ${activeLocations.length > 0 ? "lg:grid-cols-3" : "md:grid-cols-2"} gap-16 w-full mb-24 border-y border-white/5 py-20`}>
           
           <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Portalul Elitei</h5>
              <div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">
                 <Link href="/" className="hover:text-white transition-colors">Acasă</Link>
                 <Link href="/blog" className="hover:text-white transition-colors">Journal Legislativ</Link>
                 <Link href="/contact" className="hover:text-white transition-colors">Consultanță</Link>
              </div>
           </div>
 
           <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Informații Generale</h5>
              <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
                 <div className="flex flex-col items-center lg:items-start gap-2">
                    <span className="text-stone-600 text-[8px]">TELEFON PRINCIPAL</span>
                    <a href={`tel:${settings?.firmPhone || ""}`} className="text-sm tracking-widest hover:text-white transition-colors">{settings?.firmPhone || "+40 000 000 000"}</a>
                 </div>
                 <div className="flex flex-col items-center lg:items-start gap-2 max-w-full overflow-hidden">
                    <span className="text-stone-600 text-[8px]">EMAIL CONTACT</span>
                    <a href={`mailto:${settings?.firmEmail || ""}`} className="text-sm tracking-widest lowercase hover:text-white transition-colors">{settings?.firmEmail || "office@sps-asociatii.ro"}</a>
                    {settings?.supportEmails && settings.supportEmails.length > 0 && settings.supportEmails.map((email, idx) => (
                      <a key={idx} href={`mailto:${email}`} className="text-xs tracking-widest lowercase text-stone-500 hover:text-white transition-colors mt-1">{email}</a>
                    ))}
                 </div>
              </div>
           </div>
 
           {activeLocations.length > 0 && (
             <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 w-full">
                <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Sediile Noastre</h5>
                <div className="flex flex-col gap-8 w-full max-w-sm">
                  {activeLocations.map((loc) => (
                    <div key={loc.id} className="flex flex-col gap-3 group">
                       <div className="flex items-start justify-center lg:justify-start gap-4">
                          <MapPin className="w-5 h-5 text-[var(--gold-600)] shrink-0 mt-1" />
                          <div className="flex flex-col">
                             <h6 className="text-[10px] font-black uppercase tracking-widest text-stone-300">{loc.name}</h6>
                             <p className="text-[11px] text-stone-500 mt-1 uppercase tracking-wider">{loc.address}, {loc.city}</p>
                             {loc.phone && (
                               <a href={`tel:${loc.phone}`} className="text-[10px] text-[var(--gold-500)] mt-2 inline-flex items-center gap-1 hover:text-[var(--gold-400)]">
                                 {loc.phone}
                               </a>
                             )}
                          </div>
                       </div>
                       {loc.googleMapsEmbedUrl && (
                         <div className="w-full h-24 rounded-lg overflow-hidden border border-white/5 opacity-70 group-hover:opacity-100 transition-opacity mt-2">
                           <iframe 
                             src={loc.googleMapsEmbedUrl} 
                             width="100%" 
                             height="100%" 
                             style={{border: 0}} 
                             allowFullScreen={false} 
                             loading="lazy" 
                             referrerPolicy="no-referrer-when-downgrade"
                           />
                         </div>
                       )}
                    </div>
                  ))}
                </div>
             </div>
           )}
 
        </div>
 
        {/* Legal & Copyright */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
           <div className="text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-stone-600 text-center md:text-left">
              © {currentYear} {settings?.firmName || "SPS ȘI ASOCIAȚII"}. REZERVAT ELITEI JURIDICE.
           </div>
           
           <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.5em] text-stone-600">
              <Link href="/politica-confidentialitate" className="hover:text-white transition-colors">Privată</Link>
              <Link href="/termeni-si-conditii" className="hover:text-white transition-colors">Termeni</Link>
           </div>
        </div>
        
      </div>
    </footer>
  );
}
