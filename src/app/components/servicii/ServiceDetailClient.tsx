"use client";

import React from "react";
import { motion } from "framer-motion";
import { Page, ContentBlock, SiteSettings } from "@/types";
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  FileText, 
  Clock, 
  Gavel,
  Zap,
  Award
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  page: Page;
  settings: SiteSettings | null;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
  }
};

const renderBlock = (block: ContentBlock) => {
  switch (block.type) {
    case "heading": {
      const level = (block.metadata?.level as number) || 2;
      const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
      const classes = level === 2 
        ? "text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 italic text-white" 
        : "text-2xl md:text-3xl font-serif italic mb-8 text-stone-100";
      return <Tag key={block.id} className={classes}>{block.content}</Tag>;
    }

    case "paragraph":
      return (
        <p key={block.id} className="text-xl text-stone-400 font-serif italic leading-relaxed mb-10 first-letter:text-5xl first-letter:font-black first-letter:text-[var(--gold-500)] first-letter:mr-3 first-letter:float-left">
          {block.content}
        </p>
      );

    case "list":
      const items = block.content.split("\n").filter(i => i.trim());
      return (
        <ul key={block.id} className="space-y-6 mb-12">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-4 items-start group">
              <CheckCircle2 className="w-6 h-6 text-[var(--gold-500)] mt-0.5 group-hover:scale-125 transition-transform" />
              <span className="text-lg text-stone-300 font-serif italic">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "faq":
      return (
        <div key={block.id} className="p-10 border border-white/5 bg-stone-900/20 backdrop-blur-sm mb-12 group hover:border-[var(--gold-500)]/30 transition-all duration-700">
          <div className="flex gap-6 items-start mb-4">
             <HelpCircle className="w-8 h-8 text-[var(--gold-600)]" />
             <h4 className="text-2xl font-serif italic text-white">{block.content}</h4>
          </div>
          <p className="text-lg text-stone-500 font-serif italic ml-14 leading-relaxed">
            {block.metadata?.answer as string}
          </p>
        </div>
      );

    case "image":
       return (
         <div key={block.id} className="relative aspect-video w-full overflow-hidden mb-16 border border-white/5">
           <Image 
             src={block.content} 
             alt={block.metadata?.alt as string || "Imagine Serviciu"} 
             fill 
             className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
         </div>
       );

    case "cta":
      return (
        <div key={block.id} className="py-20 px-8 bg-[var(--gold-500)]/5 border-y border-white/5 text-center mb-16 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(197,160,89,0.1)_0%,_transparent_70%)]" />
           <motion.h4 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-8 relative z-10">{block.content}</motion.h4>
           <Link href="/contact" className="inline-flex items-center gap-6 px-12 py-6 bg-[var(--gold-500)] text-black text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all relative z-10 group">
              Solicită Analiză Caz <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
           </Link>
        </div>
      );

    default:
      return null;
  }
};

export default function ServiceDetailClient({ page, settings }: Props) {
  return (
    <article className="bg-[#050505] text-white selection:bg-[var(--gold-500)] selection:text-black min-h-screen">
      
      {/* --- HERO --- */}
      <section className="relative pt-64 pb-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(197,160,89,0.15)_0%,_transparent_60%)]" />
        
        {page.featuredImage && (
           <div className="absolute inset-0 opacity-20 pointer-events-none grayscale mix-blend-overlay">
              <Image src={page.featuredImage} alt={page.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
           </div>
        )}

        <div className="max-w-7xl mx-auto relative z-10 text-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-20 h-20 rounded-full border border-[var(--gold-500)]/30 mx-auto flex items-center justify-center mb-10 text-[var(--gold-500)]"
           >
              <Scale className="w-8 h-8" />
           </motion.div>

           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-[12px] font-black uppercase tracking-[0.6em] text-[var(--gold-600)] block mb-6 px-4 py-1 border-x border-[var(--gold-900)] w-fit mx-auto"
           >
              Expertiză de Top
           </motion.span>
           
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] mb-12"
           >
             {page.h1}
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-xl md:text-2xl text-stone-500 font-serif italic max-w-3xl mx-auto"
           >
             {page.excerpt}
           </motion.p>
        </div>
      </section>

      {/* --- MAIN CONTENT & SIDEBAR --- */}
      <section className="pb-60 px-8 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24">
            
            {/* CONTENT AREA */}
            <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
               className="lg:w-2/3"
            >
               <div className="space-y-2">
                  {page.content.map(block => renderBlock(block))}
               </div>

               {/* ADDITIONAL TRUST SIGNALS */}
               <div className="mt-24 pt-24 border-t border-white/5 grid md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                     <ShieldCheck className="w-10 h-10 text-[var(--gold-500)]" />
                     <h5 className="text-xs font-black uppercase tracking-widest text-stone-200">Confidențialitate Certificată</h5>
                     <p className="text-sm text-stone-500 font-serif italic">Protocol de securitate avocat-client de grad militar.</p>
                  </div>
                  <div className="space-y-4">
                     <Clock className="w-10 h-10 text-[var(--gold-500)]" />
                     <h5 className="text-xs font-black uppercase tracking-widest text-stone-200">Răspuns Rapid</h5>
                     <p className="text-sm text-stone-500 font-serif italic">Analiză preliminară a cazului în maxim 4 spitale de la solicitare.</p>
                  </div>
                  <div className="space-y-4">
                     <Award className="w-10 h-10 text-[var(--gold-500)]" />
                     <h5 className="text-xs font-black uppercase tracking-widest text-stone-200">Excelență Recunoscută</h5>
                     <p className="text-sm text-stone-500 font-serif italic">Peste 15 ani de victorii în cauze cu miză ridicată.</p>
                  </div>
               </div>
            </motion.div>

            {/* SIDEBAR */}
            <aside className="lg:w-1/3 lg:sticky lg:top-40 h-fit space-y-12">
               
               <div className="p-12 bg-stone-900/30 border border-white/5 backdrop-blur-xl relative group">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--gold-500)]" />
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-stone-400 mb-10 border-b border-white/5 pb-6">Detalii Procedurale</h3>
                  
                  <div className="space-y-8">
                     <div className="flex gap-4 items-start">
                        <FileText className="w-5 h-5 text-[var(--gold-600)] shrink-0 mt-1" />
                        <div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 block mb-1">Documente Necesare</span>
                           <p className="text-sm font-serif italic text-white leading-relaxed">Act de identitate, înscrisuri doveditoare, contracte relevante.</p>
                        </div>
                     </div>
                     <div className="flex gap-4 items-start">
                        <Clock className="w-5 h-5 text-[var(--gold-600)] shrink-0 mt-1" />
                        <div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 block mb-1">Durată Estimativă</span>
                           <p className="text-sm font-serif italic text-white leading-relaxed">Depinde de complexitate (uzual 2-6 săptămâni).</p>
                        </div>
                     </div>
                     <div className="flex gap-4 items-start">
                        <Zap className="w-5 h-5 text-[var(--gold-600)] shrink-0 mt-1" />
                        <div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 block mb-1">Mod de Lucru</span>
                           <p className="text-sm font-serif italic text-white leading-relaxed">Hybrid (Online & Office) pentru eficiență maximă.</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-12">
                     <Link href="/contact" className="w-full flex items-center justify-center gap-4 py-6 border border-[var(--gold-600)] text-[var(--gold-400)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--gold-600)] hover:text-black transition-all">
                        Solicită Consultanță <ArrowRight className="w-4 h-4" />
                     </Link>
                  </div>
               </div>

               <div className="p-12 border border-white/5 text-center space-y-6">
                  <Gavel className="w-12 h-12 text-stone-700 mx-auto" />
                  <p className="text-xs text-stone-500 font-serif italic italic">
                    "Justiția este virtutea prin care fiecare primește ceea ce i se cuvine."
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--gold-900)]">— Cicero</span>
               </div>
               
            </aside>
         </div>
      </section>

   </article>
  );
}
