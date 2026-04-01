"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageClient({ title, lastUpdated, children }: Props) {
  return (
    <article className="bg-[#050505] text-white selection:bg-[var(--gold-500)] selection:text-black min-h-screen">
      
      {/* --- HERO --- */}
      <section className="relative pt-64 pb-20 px-8 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(197,160,89,0.1)_0%,_transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
           <Link href="/" className="inline-flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-stone-600 hover:text-[var(--gold-500)] transition-colors mb-12">
              <ArrowLeft className="w-3 h-3" /> Înapoi la Start
           </Link>
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-16 h-16 rounded-full border border-stone-800 mx-auto flex items-center justify-center mb-6 text-stone-500"
           >
              <Shield className="w-6 h-6" />
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]"
           >
             {title}
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-xs font-black uppercase tracking-[0.4em] text-stone-600"
           >
             Ultima actualizare: {lastUpdated}
           </motion.p>
        </div>
      </section>

      {/* --- CONTENT --- */}
      <section className="py-32 px-8 relative z-10">
         <div className="max-w-3xl mx-auto prose prose-invert prose-stone">
            <div className="space-y-12 text-stone-400 font-serif italic text-lg leading-relaxed">
               {children}
            </div>
         </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="pb-40 px-8 text-center">
         <div className="max-w-2xl mx-auto p-12 border border-white/5 bg-stone-900/10 backdrop-blur-sm space-y-6">
            <FileText className="w-8 h-8 text-[var(--gold-800)] mx-auto" />
            <p className="text-sm text-stone-500 font-serif italic italic">
               Pentru clarificări suplimentare privind termenii noștri legali, vă rugăm să ne contactați direct.
            </p>
            <Link href="/contact" className="inline-block text-[10px] font-black uppercase tracking-widest text-[var(--gold-500)] hover:text-white transition-colors">
               Contact Echipa Legală
            </Link>
         </div>
      </section>

   </article>
  );
}
