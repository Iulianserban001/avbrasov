"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Scale, Shield, Gavel, FileText, Phone, MapPin, 
  ChevronRight, ArrowRight, Star, Globe, Check,
  Zap, Award, Users, BookOpen, Calendar, Briefcase
} from "lucide-react";
import Link from "next/link";
import type { SiteSettings, LegalService, OfficeLocation, BlogPost, UserProfile } from "@/types";

interface HomeClientProps {
  settings: SiteSettings | null;
  services: LegalService[];
  locations: OfficeLocation[];
  latestPosts: BlogPost[];
  attorneys: UserProfile[];
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

const FALLBACK_ATTORNEYS = [
  { id: '1', name: 'Victor Mănescu', role: 'Proprietar / Avocat Coordonator', bio: 'Experiență de peste 15 ani în litigii comerciale complexe și arbitraj internațional. Strateg vizionar în apărare penală a afacerilor.', avatarUrl: '/images/lawyer1.png', practiceAreas: ['Litigii', 'Drept Comercial'] },
  { id: '2', name: 'Elena Popescu', role: 'Avocat Partener Senior', bio: 'Expert recunoscut în fuziuni, achiziții și drept corporatist. Asigură excelența juridică pentru corporații multinaționale și investitori strategici.', avatarUrl: '/images/lawyer2.png', practiceAreas: ['Corporate', 'Business Law'] },
  { id: '3', name: 'Alexandru Istrate', role: 'Strateg Juridic', bio: 'Conduce departamentul de real estate și negocieri strategice. Cunoscut pentru determinarea și acuratețea cu care securizează portofolii de referință.', avatarUrl: '/images/lawyer3.png', practiceAreas: ['Real Estate', 'Executări'] },
];

export default function HomeClient({ settings, services, locations, latestPosts, attorneys }: HomeClientProps) {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [activeLawyer, setActiveLawyer] = useState<string | null>(null);

  // Use managed attorneys if available, else fallbacks
  const displayAttorneys = attorneys.length >= 3 ? attorneys.slice(0, 3) : FALLBACK_ATTORNEYS;

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
           {['Echipa', 'Expertiză', 'Servicii', 'Blog', 'Locații'].map((item) => (
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
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-[#050505] z-10" />
           <img 
             src={settings?.heroImageUrl || DEFAULT_HERO} 
             alt="Elite Law Firm Brașov" 
             className="w-full h-full object-cover scale-110" 
           />
         </motion.div>

         <div className="relative z-20 text-center max-w-6xl px-8 w-full flex flex-col items-center">
            <motion.div 
               style={{ opacity: heroOpacity }}
               initial="hidden" 
               animate="visible" 
               variants={staggerContainer}
               className="space-y-10 w-full flex flex-col items-center"
            >
               <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-px bg-[var(--gold-600)]/30" />
                  <span className="text-[11px] font-black uppercase tracking-[0.6em] text-[var(--gold-500)] italic text-center">
                    {settings?.firmName || "SPS ȘI ASOCIAȚII"}
                  </span>
                  <div className="w-12 h-px bg-[var(--gold-600)]/30" />
               </motion.div>
               
               <motion.h1 
                  variants={fadeInUp}
                  className="text-6xl md:text-8xl lg:text-[11rem] font-serif text-white leading-[0.85] tracking-tighter mb-8 uppercase text-center w-full"
               >
                  {settings?.homeH1?.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "italic text-[var(--gold-400)] block lg:inline" : "block lg:inline"}>
                       {word}{' '}
                    </span>
                  )) || <>Justiție de <br className="hidden lg:block"/><span className="italic italic-gold text-[var(--gold-400)]">Prestigiu.</span></>}
               </motion.h1>

               <motion.p 
                  variants={fadeInUp}
                  className="text-lg md:text-2xl text-stone-300 max-w-4xl mx-auto font-serif italic leading-relaxed mb-16 text-center"
               >
                  {settings?.homeSubtitle || settings?.firmDescription || "Apărăm drepturile și interesele clienților noștri cu o rigoare academică și o strategie juridică de neegalat în județul Brașov."}
               </motion.p>

               <motion.div 
                  variants={fadeInUp}
                  className="flex flex-col md:flex-row items-center justify-center gap-8 w-full"
               >
                  <Link href="/contact" className="btn-elite-wide px-16 py-6 border-[0.5px] border-[var(--gold-500)] bg-[var(--gold-500)]/10 text-[var(--gold-400)] text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-[var(--gold-500)] hover:text-black transition-all group backdrop-blur-sm">
                    {settings?.ctaPrimary || "Programează Consultanță"} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <button className="px-16 py-6 border-[0.5px] border-stone-800 text-stone-400 text-[11px] font-black uppercase tracking-[0.4em] hover:text-white hover:border-white transition-all backdrop-blur-md">
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

      {/* --- ECHIPA (INTERACTIVE SILHOUETTES) --- */}
      <section id="echipa" className="py-40 bg-[#030303] border-b border-white/5 relative">
         <div className="max-w-[1400px] mx-auto px-8 w-full">
            <div className="text-center space-y-6 mb-24">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)] block">Liderii Apărării</span>
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none mx-auto">
                 Avocații <br className="md:hidden"/> <span className="text-[var(--gold-500)]">Tăi.</span>
               </h2>
               <p className="text-lg text-stone-400 font-serif italic max-w-2xl mx-auto pt-6">Echipa administrată direct din portal, definită de putere, excelență și viziune legală.</p>
            </div>

            <div className="flex flex-col lg:flex-row h-[800px] gap-4">
               {displayAttorneys.map((attorney) => (
                  <motion.div 
                     key={attorney.id}
                     layout
                     onMouseEnter={() => setActiveLawyer(attorney.id)}
                     onMouseLeave={() => setActiveLawyer(null)}
                     onClick={() => setActiveLawyer(attorney.id)}
                     className={`relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex-1`}
                     style={{
                        flexGrow: activeLawyer === attorney.id ? 3 : 1,
                        filter: activeLawyer === attorney.id ? 'grayscale(0%) contrast(100%)' : 'grayscale(100%) contrast(120%) brightness(0.6)',
                     }}
                  >
                     <img 
                        src={attorney.avatarUrl || DEFAULT_HERO} 
                        alt={attorney.name} 
                        className="absolute inset-0 w-full h-full object-cover object-top"
                     />
                     <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-700 ${activeLawyer === attorney.id ? 'opacity-80' : 'opacity-100'}`} />
                     
                     <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className={`transition-all duration-700 transform ${activeLawyer === attorney.id ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-60'}`}>
                           <h3 className="text-3xl md:text-5xl font-black uppercase italic text-white tracking-tighter mb-2">{attorney.name}</h3>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold-500)] mb-6">{attorney.role === 'OWNER' ? 'Partener Coordonator' : 'Avocat Senior'}</p>
                           
                           <AnimatePresence>
                              {activeLawyer === attorney.id && (
                                 <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                 >
                                    <p className="text-sm font-serif italic text-stone-300 leading-relaxed mb-8 max-w-sm">
                                       {attorney.bio}
                                    </p>
                                    
                                    {(attorney.practiceAreas?.length ?? 0) > 0 && (
                                       <div className="flex flex-wrap gap-3">
                                          {attorney.practiceAreas!.slice(0,3).map((area: string) => (
                                             <div key={area} className="flex items-center gap-2 px-3 py-1.5 border border-white/20 backdrop-blur-md text-[9px] font-black tracking-widest uppercase text-white">
                                                <Briefcase className="w-3 h-3 text-[var(--gold-500)]" /> {area}
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- STRATEGIC ADVANTAGE (CENTERED REDESIGN) --- */}
      <section id="expertiză" className="py-40 px-8 border-b border-white/5 relative bg-[#050505]">
         <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--gold-900)_0%,_transparent_70%)] opacity-5 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto text-center space-y-12">
            <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
               className="space-y-6 max-w-4xl mx-auto"
            >
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)] block">PRESTIGIUL REZULTATELOR</span>
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none mx-auto">
                 Excelență <br/> <span className="text-[var(--gold-500)]">Incontestabilă.</span>
               </h2>
               <p className="text-xl text-stone-400 font-serif leading-loose italic max-w-2xl mx-auto pt-6">
                 Cabinetul nostru nu oferă doar asistență legală; oferim certitudinea unei apărări construite pe fundamente academice solide și o experiență vastă.
               </p>
            </motion.div>

            <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
               className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-white/5"
            >
               {[
                 { icon: Zap, title: "Strategie Agresivă", desc: "Anticipăm și neutralizăm riscurile." },
                 { icon: Award, title: "Rigoare Academică", desc: "Analiză bazată pe doctrine de vârf." },
                 { icon: Users, title: "Abordare Elitară", desc: "Discreție și eficiență maximă." },
                 { icon: Globe, title: "Viziune Globală", desc: "Sincronizare cu dreptul european." }
               ].map((feat, i) => (
                 <motion.div variants={fadeInUp} key={i} className="group flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full border-[0.5px] border-stone-800 flex items-center justify-center group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/5 transition-all duration-500">
                       <feat.icon className="w-8 h-8 text-[var(--gold-600)]" />
                    </div>
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest text-white mb-3">{feat.title}</h4>
                       <p className="text-[11px] text-stone-500 leading-relaxed uppercase font-bold tracking-tighter">{feat.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </motion.div>
         </div>
      </section>

      {/* --- SERVICII (CENTERED EDITORIAL) --- */}
      <section id="servicii" className="py-40 px-8 bg-[#080808]">
         <div className="max-w-7xl mx-auto text-center space-y-6 mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600 block">ARIA DE EXPERTIZĂ</span>
            <h3 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none mx-auto">Piloni <br/><span className="text-[var(--gold-500)]">Juridici.</span></h3>
            <div className="pt-8">
               <button className="btn-elite px-12 py-5 border-[0.5px] border-stone-800 text-stone-400 text-[10px] font-black uppercase tracking-[0.4em] hover:border-[var(--gold-500)] hover:text-white transition-all mx-auto">
                  Descarcă Broșura Digitală
               </button>
            </div>
         </div>

         <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-white/5 border border-white/5 p-[0.5px]">
            {services.map((service) => (
              <div key={service.id} className="group relative p-16 bg-[#080808] hover:bg-[#030303] transition-all duration-700 text-center flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full border-[0.5px] border-stone-800 flex items-center justify-center text-[var(--gold-500)] mb-10 group-hover:scale-110 group-hover:border-[var(--gold-500)] transition-all duration-500">
                   <Gavel className="w-6 h-6" />
                 </div>
                 <h4 className="text-3xl font-serif text-white mb-6 group-hover:text-[var(--gold-400)] transition-colors italic uppercase tracking-tight">{service.name}</h4>
                 <p className="text-sm text-stone-500 font-serif leading-relaxed mb-10 italic">
                   {service.description || "Asistență de cel mai înalt nivel, calibrată pentru succes excepțional."}
                 </p>
                 <Link href={`/servicii/${service.slug}`} className="inline-flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--gold-600)] group-hover:text-white transition-all mt-auto">
                   Explorează Cazistica <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
            ))}
         </div>
      </section>

      {/* --- LATEST ARTICLES (CENTERED SEO POWERHOUSE) --- */}
      <section id="articole" className="py-40 px-8 bg-[#030303] border-t border-white/5">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-6">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)] block">PERSPECTIVE ȘI ANALIZE</span>
               <h3 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none mx-auto mb-10">Journal <br/> <span className="text-[var(--gold-500)]">Legislativ.</span></h3>
               <Link href="/blog" className="inline-flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-white transition-colors border-b border-stone-800 pb-2 hover:border-white">
                  Vezi Toate Articolele <BookOpen className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
               {latestPosts.map((post) => (
                 <Link key={post.id} href={`/blog/${post.slug}`} className="group space-y-8 block text-center">
                    <div className="aspect-[4/3] overflow-hidden bg-stone-900 border border-stone-800 relative mb-8">
                       {post.featuredImage ? (
                         <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center"><FileText className="w-12 h-12 text-stone-800" /></div>
                       )}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <span className="px-8 py-4 border-[0.5px] border-[var(--gold-500)] text-[10px] font-black uppercase tracking-widest text-[var(--gold-400)]">Aprofundează</span>
                       </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest text-[var(--gold-600)] mb-6">
                       <Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('ro-RO')}
                    </div>
                    <h4 className="text-3xl font-serif text-white group-hover:text-[var(--gold-400)] transition-colors leading-tight italic px-4">
                       {post.title}
                    </h4>
                    <p className="text-sm text-stone-500 font-serif italic line-clamp-2 leading-relaxed px-6">
                       {post.excerpt}
                    </p>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* --- ELITE FOOTER --- */}
      <footer className="py-32 px-8 bg-black border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-16 mb-24">
            <div className="space-y-6">
               <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white italic">SPS</span>
                  <span className="text-xs font-black tracking-[0.6em] uppercase text-[var(--gold-500)] mt-2">ȘI ASOCIAȚII</span>
               </div>
               <p className="text-stone-500 font-serif italic text-xl leading-relaxed max-w-xl mx-auto">
                 Definim standardele excelenței juridice prin rigoare, integritate și o viziune strategică de neegalat.
               </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
               <Link href="/" className="hover:text-[var(--gold-500)] transition-colors">Acasă</Link>
               <Link href="/blog" className="hover:text-[var(--gold-500)] transition-colors">Journal Legislativ</Link>
               <Link href="/contact" className="hover:text-[var(--gold-500)] transition-colors">Contact Rapid</Link>
               <Link href="/admin" className="hover:text-white text-stone-600 transition-colors">CMA Portal</Link>
            </div>
         </div>
         
         <div className="max-w-5xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-600">
               © {new Date().getFullYear()} SPS ȘI ASOCIAȚII. Toate Drepturile Rezervate.
            </p>
            <div className="flex gap-10 text-[9px] font-black uppercase tracking-widest text-stone-600">
               <Link href="/politica-confidentialitate" className="hover:text-white transition-colors">Confidențialitate</Link>
               <Link href="/termeni-si-conditii" className="hover:text-white transition-colors">Termeni Legali</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
