"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Scale, Shield, Gavel, FileText, Phone, MapPin, 
  ChevronRight, ArrowRight, Star, Globe, Check,
  Zap, Award, Users, BookOpen, Calendar
} from "lucide-react";
import Link from "next/link";
import type { SiteSettings, LegalService, OfficeLocation, BlogPost } from "@/types";

interface HomeClientProps {
  settings: SiteSettings | null;
  services: LegalService[];
  locations: OfficeLocation[];
  latestPosts: BlogPost[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const DEFAULT_HERO = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop";

export default function HomeClient({ settings, services, locations, latestPosts }: HomeClientProps) {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen bg-[#050505] text-stone-200 selection:bg-[var(--gold-500)] selection:text-stone-950 font-sans">
      
      {/* --- ELITE NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="fixed top-0 inset-x-0 z-50 h-24 flex items-center justify-between px-8 md:px-16 lg:px-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px]"
      >
        <Link href="/" className="flex items-center gap-3 group">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.firmName} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-stone-900 border border-white/10 flex items-center justify-center group-hover:border-[var(--gold-500)] transition-colors">
                <Scale className="w-6 h-6 text-[var(--gold-500)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter uppercase leading-none text-white italic">SPS</span>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[var(--gold-500)]">ȘI ASOCIAȚII</span>
              </div>
            </div>
          )}
        </Link>
        
        <div className="hidden lg:flex items-center gap-12">
           {['Expertiză', 'Servicii', 'Blog', 'Locații'].map((item) => (
             <Link 
               key={item} 
               href={item === "Blog" ? "/blog" : `/#${item.toLowerCase()}`} 
               className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-white transition-all relative group"
             >
               {item}
               <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold-500)] group-hover:w-full transition-all duration-300" />
             </Link>
           ))}
           <Link href="/contact" className="btn-elite px-8 py-3.5 text-[10px] bg-white text-black font-black uppercase tracking-widest hover:bg-[var(--gold-500)] hover:text-white transition-all">
             Contact Rapid
           </Link>
        </div>
      </motion.nav>

      {/* --- CINEMATIC HERO (CENTERED & DRAMATIC) --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
         <motion.div style={{ y: yParallax }} className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#050505] z-10" />
           <img 
             src={settings?.heroImageUrl || DEFAULT_HERO} 
             alt="Elite Law Firm Brașov" 
             className="w-full h-full object-cover scale-110" 
           />
         </motion.div>

         <div className="relative z-20 text-center max-w-6xl px-8">
            <motion.div 
               style={{ opacity: heroOpacity }}
               initial="hidden" 
               animate="visible" 
               variants={staggerContainer}
               className="space-y-10"
            >
               <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-px bg-[var(--gold-600)]/30" />
                  <span className="text-[11px] font-black uppercase tracking-[0.6em] text-[var(--gold-500)] italic">
                    {settings?.firmName || "SPS ȘI ASOCIAȚII"}
                  </span>
                  <div className="w-12 h-px bg-[var(--gold-600)]/30" />
               </motion.div>
               
               <motion.h1 
                  variants={fadeInUp}
                  className="text-6xl md:text-8xl lg:text-[11rem] font-serif text-white leading-[0.85] tracking-tighter mb-8 uppercase"
               >
                  {settings?.homeH1?.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "italic text-[var(--gold-400)] block md:inline" : ""}>
                      {word}{' '}
                    </span>
                  )) || <>Justiție de <br/><span className="italic italic-gold text-[var(--gold-400)]">Prestigiu.</span></>}
               </motion.h1>

               <motion.p 
                  variants={fadeInUp}
                  className="text-lg md:text-2xl text-stone-300 max-w-3xl mx-auto font-serif italic leading-relaxed mb-16"
               >
                  {settings?.homeSubtitle || settings?.firmDescription || "Apărăm drepturile și interesele clienților noștri cu o rigoare academică și o strategie juridică de neegalat în județul Brașov."}
               </motion.p>

               <motion.div 
                  variants={fadeInUp}
                  className="flex flex-col md:flex-row items-center justify-center gap-8"
               >
                  <Link href="/contact" className="btn-elite-wide px-16 py-6 bg-[var(--gold-500)] text-stone-950 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-white transition-all group scale-105">
                    {settings?.ctaPrimary || "Programează Consultanță"} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <button className="px-16 py-6 border-2 border-stone-800 text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all backdrop-blur-md">
                    {settings?.ctaSecondary || "Vezi Expertiza"}
                  </button>
               </motion.div>
            </motion.div>
         </div>

         {/* Scroll Hint */}
         <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
         >
            <div className="w-px h-24 bg-gradient-to-b from-[var(--gold-500)] to-transparent" />
         </motion.div>
      </section>

      {/* --- STRATEGIC ADVANTAGE --- */}
      <section id="expertiză" className="py-40 px-8 md:px-24 border-b border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--gold-900)_0%,_transparent_70%)] opacity-5" />
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
            <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
               className="space-y-12"
            >
               <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)]">PRESTIGIUL REZULTATELOR</span>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
                    Excelență <br/> <span className="text-[var(--gold-500)]">Incontestabilă.</span>
                  </h2>
               </div>
               <p className="text-xl text-stone-400 font-serif leading-loose italic">
                 Cabinetul nostru nu oferă doar asistență legală; oferim certitudinea unei apărări construite pe fundamente academice solide și o experiență vastă în cele mai complexe instanțe din România.
               </p>
               <div className="grid sm:grid-cols-2 gap-12 pt-8">
                  {[
                    { icon: Zap, title: "Strategie Agresivă", desc: "Anticipăm și neutralizăm riscurile înainte ca ele să devină obstacole." },
                    { icon: Award, title: "Rigoare Academică", desc: "Fiecare speță este analizată prin prisma celor mai recente doctrine." },
                    { icon: Users, title: "Abordare Elitară", desc: "Clienții noștri beneficiază de atenție exclusivă și discreție totală." },
                    { icon: Globe, title: "Viziune Globală", desc: "Sincronizăm legislația locală cu standardele europene de drept." }
                  ].map((feat, i) => (
                    <div key={i} className="group space-y-4">
                       <feat.icon className="w-8 h-8 text-stone-700 group-hover:text-[var(--gold-500)] transition-colors" />
                       <h4 className="text-sm font-black uppercase tracking-widest text-white">{feat.title}</h4>
                       <p className="text-[11px] text-stone-500 leading-relaxed uppercase font-bold tracking-tighter">{feat.desc}</p>
                    </div>
                  ))}
               </div>
            </motion.div>

            <motion.div 
               initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }}
               className="relative aspect-[3/4] bg-stone-900 overflow-hidden"
            >
               <img 
                 src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2670&auto=format&fit=crop" 
                 alt="SPS și Asociații Professional Office" 
                 className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" 
               />
               <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none" />
               <div className="absolute -bottom-10 -left-10 p-16 bg-black border border-white/5 z-20 shadow-2xl max-w-sm hidden xl:block">
                  <Star className="w-8 h-8 text-[var(--gold-500)] mb-6 fill-[var(--gold-500)]" />
                  <p className="text-lg text-white font-serif italic mb-6 leading-relaxed">
                    "O forță juridică de neîntrecut în Brașov. Strategia implementată a fost diferențiatorul cheie în victoria noastră."
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold-500)]">Consiliu Admin, Brașov Dev</span>
               </div>
            </motion.div>
         </div>
      </section>

      {/* --- SERVICES (ELITE GRID) --- */}
      <section id="servicii" className="py-40 px-8 md:px-24 bg-[#080808]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600">ARIA DE EXPERTIZĂ</span>
               <h3 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">Piloni Juridici.</h3>
            </div>
            <button className="btn-elite px-12 py-5 border-2 border-stone-800 text-stone-400 text-[10px] font-black uppercase tracking-[0.4em] hover:border-[var(--gold-500)] hover:text-white transition-all">
               Descarcă Broșura Digitală
            </button>
         </div>

         <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-1px bg-white/5 border border-white/5">
            {services.map((service) => (
              <div key={service.id} className="group relative p-16 bg-[#080808] hover:bg-black transition-all duration-500">
                 <div className="w-14 h-14 rounded-full border border-stone-800 flex items-center justify-center text-[var(--gold-500)] mb-10 group-hover:bg-[var(--gold-500)] group-hover:text-black transition-all duration-500">
                   <Gavel className="w-6 h-6" />
                 </div>
                 <h4 className="text-3xl font-serif text-white mb-6 group-hover:text-[var(--gold-400)] transition-colors italic">{service.name}</h4>
                 <p className="text-sm text-stone-500 font-serif leading-relaxed mb-10 italic opacity-70">
                   {service.description || "Asistență de cel mai înalt nivel, calibrată pentru succes."}
                 </p>
                 <Link href={`/servicii/${service.slug}`} className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-stone-600 group-hover:text-[var(--gold-500)] transition-all">
                   Analiză Detaliată <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
            ))}
         </div>
      </section>

      {/* --- LATEST ARTICLES (SEO POWERHOUSE) --- */}
      <section id="articole" className="py-40 px-8 md:px-24 bg-black">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
               <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)]">PERSPECTIVE ȘI ANALIZE</span>
                  <h3 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">Journal <br/> <span className="text-[var(--gold-500)]">Legislativ.</span></h3>
               </div>
               <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors flex items-center gap-3">
                  Vezi Toate Articolele <BookOpen className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
               {latestPosts.map((post) => (
                 <Link key={post.id} href={`/blog/${post.slug}`} className="group space-y-8 block">
                    <div className="aspect-[16/10] overflow-hidden bg-stone-900 relative">
                       {post.featuredImage ? (
                         <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center"><FileText className="w-12 h-12 text-stone-800" /></div>
                       )}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-6 py-3 border border-white text-[9px] font-black uppercase tracking-widest text-white">Citește Articolul</span>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[var(--gold-600)]">
                          <Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('ro-RO')}
                       </div>
                       <h4 className="text-2xl font-serif text-white group-hover:text-[var(--gold-400)] transition-colors leading-tight italic">
                          {post.title}
                       </h4>
                       <p className="text-sm text-stone-500 font-serif italic line-clamp-2 leading-relaxed">
                          {post.excerpt}
                       </p>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* --- REȚEA SEDII (MINIMAL DARK) --- */}
      <section id="locații" className="py-40 px-8 md:px-24 bg-[#050505] border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-32">
            <div className="lg:w-1/3 space-y-16">
               <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600">PREZENȚĂ STRATEGICĂ</span>
                  <h3 className="text-5xl md:text-7xl font-serif text-white tracking-tighter leading-none italic uppercase font-black">Rețeaua <br/> SPS.</h3>
               </div>
               <div className="space-y-8">
                  {locations.map((loc) => (
                    <div key={loc.id} className="group space-y-2 pb-8 border-b border-white/5 hover:border-[var(--gold-500)]/30 transition-all">
                       <h5 className="text-lg font-serif italic text-white group-hover:text-[var(--gold-400)] transition-colors">{loc.name}</h5>
                       <p className="text-xs text-stone-500 uppercase tracking-widest leading-relaxed mb-4">{loc.address}</p>
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-[var(--gold-500)] tracking-widest">{loc.phone}</span>
                          <Link href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`} target="_blank" className="text-[10px] font-black text-stone-600 hover:text-white transition-colors uppercase">Indicatii →</Link>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="lg:w-2/3 aspect-video bg-black p-1 border border-white/5 bg-[#111]">
               <iframe 
                 src={settings?.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d174116.73228833958!2d25.437145899999998!3d45.6521799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b35c7ee0dfb819%3A0x153288a7605d8f78!2zQmRvdG92LCBCcmHFm292!5e0!3m2!1sen!2sro!4v1711910000000!5m2!1sen!2sro"} 
                 width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="grayscale contrast-125 invert-[0.9] hue-rotate-180"
               />
            </div>
         </div>
      </section>

      {/* --- ELITE FOOTER --- */}
      <footer className="py-32 px-8 md:px-24 bg-black border-t border-white/5">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20 text-left mb-24">
            <div className="md:col-span-2 space-y-10">
               <div className="flex flex-col">
                  <span className="text-3xl font-black tracking-tighter uppercase leading-none text-white italic">SPS</span>
                  <span className="text-xs font-black tracking-[0.5em] uppercase text-[var(--gold-500)]">ȘI ASOCIAȚII</span>
               </div>
               <p className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-sm">
                 Definim standardele excelenței juridice prin rigoare, integritate și o viziune strategică de neegalat.
               </p>
            </div>
            <div className="space-y-8">
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Navigație</h5>
               <ul className="space-y-4 text-stone-500 text-[10px] font-black uppercase tracking-widest">
                  <li><Link href="/" className="hover:text-[var(--gold-500)]">Acasă</Link></li>
                  <li><Link href="/blog" className="hover:text-[var(--gold-500)]">Blog Juridic</Link></li>
                  <li><Link href="/contact" className="hover:text-[var(--gold-500)]">Contact</Link></li>
                  <li><Link href="/admin" className="hover:text-[var(--gold-500)] underline decoration-stone-800">CMA Portal</Link></li>
               </ul>
            </div>
            <div className="space-y-8">
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Social</h5>
               <ul className="space-y-4 text-stone-500 text-[10px] font-black uppercase tracking-widest">
                  <li><Link href={settings?.socialLinkedIn || "#"} className="hover:text-[var(--gold-500)]">LinkedIn</Link></li>
                  <li><Link href={settings?.socialFacebook || "#"} className="hover:text-[var(--gold-500)]">Facebook</Link></li>
                  <li><Link href={settings?.socialInstagram || "#"} className="hover:text-[var(--gold-500)]">Instagram</Link></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-700">
               © {new Date().getFullYear()} SPS ȘI ASOCIAȚII. EXCELENȚĂ ÎN AVOCATURĂ.
            </p>
            <div className="flex gap-10 text-[9px] font-black uppercase tracking-widest text-stone-800">
               <Link href="/politica-confidentialitate">Confidențialitate</Link>
               <Link href="/termeni-si-conditii">Termeni Legali</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
