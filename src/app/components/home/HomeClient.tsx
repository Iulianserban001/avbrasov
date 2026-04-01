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
      
      {/* Navigation and Footer are now Global in layout.tsx */}

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

         <div className="relative z-20 text-center max-w-7xl mx-auto px-8 w-full flex flex-col items-center justify-center">
            <motion.div 
               style={{ opacity: heroOpacity }}
               initial="hidden" 
               animate="visible" 
               variants={staggerContainer}
               className="space-y-12 w-full flex flex-col items-center justify-center"
            >
               <motion.div variants={fadeInUp} className="flex items-center justify-center gap-6 mb-4">
                  <div className="w-16 h-px bg-[var(--gold-600)]/40" />
                  <span className="text-[12px] font-black uppercase tracking-[0.8em] text-[var(--gold-500)] italic text-center">
                    {settings?.firmName || "SPS ȘI ASOCIAȚII"}
                  </span>
                  <div className="w-16 h-px bg-[var(--gold-600)]/40" />
               </motion.div>
               
               <motion.h1 
                  variants={fadeInUp}
                  className="text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-serif text-white leading-[0.8] tracking-tighter mb-12 uppercase text-center w-full max-w-6xl"
               >
                  {settings?.homeH1?.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "italic text-[var(--gold-400)] block lg:inline" : "block lg:inline"}>
                       {word}{' '}
                    </span>
                  )) || <>Justiție de <br className="hidden lg:block"/><span className="italic italic-gold text-[var(--gold-400)]">Prestigiu.</span></>}
               </motion.h1>

               <motion.p 
                  variants={fadeInUp}
                  className="text-xl md:text-3xl text-stone-300 max-w-4xl mx-auto font-serif italic leading-relaxed mb-20 text-center"
               >
                  {settings?.homeSubtitle || settings?.firmDescription || "Apărăm drepturile și interesele clienților noștri cu o rigoare academică și o strategie juridică de neegalat în județul Brașov."}
               </motion.p>

               <motion.div 
                   variants={fadeInUp}
                   className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full pt-10"
                >
                   <Link href="/contact" className="btn-elite-wide w-full sm:w-auto min-w-[300px] justify-center">
                      {settings?.ctaPrimary || "Solicită Consultanță"} <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
                   </Link>
                   <Link href="#expertiza" className="btn-elite w-full sm:w-auto min-w-[300px] justify-center">
                      {settings?.ctaSecondary || "Explorați Expertiza"}
                   </Link>
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
      <section id="echipa" className="py-60 bg-[#030303] border-b border-white/5 relative z-10 w-full overflow-hidden">
         <div className="max-w-[1800px] mx-auto px-8 w-full flex flex-col items-center justify-center text-center">
            <div className="text-center space-y-12 mb-40 w-full flex flex-col items-center">
               <span className="text-[12px] font-black uppercase tracking-[0.8em] text-[var(--gold-600)] block text-center">LIDERII APĂRĂRII</span>
               <h2 className="text-7xl md:text-[8rem] lg:text-[11rem] font-black tracking-tighter text-white uppercase italic leading-none mx-auto text-center w-full">
                 Avocații <br className="md:hidden"/> <span className="text-[var(--gold-500)]">Tăi.</span>
               </h2>
               <p className="text-2xl text-stone-500 font-serif italic max-w-4xl mx-auto pt-12 leading-relaxed text-center">Echipa administrată direct din portal, definită prin putere strategică, excelență academică și o viziune legală neclintită.</p>
            </div>

            <div className="flex flex-col lg:flex-row min-h-[100vh] gap-6 w-full items-stretch">
               {displayAttorneys.map((attorney) => (
                  <motion.div 
                     key={attorney.id}
                     layout
                     onMouseEnter={() => setActiveLawyer(attorney.id)}
                     onMouseLeave={() => setActiveLawyer(null)}
                     onClick={() => setActiveLawyer(attorney.id)}
                     className={`relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex-1 h-[700px] lg:h-auto`}
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
                                    <p className="text-sm font-serif italic text-stone-300 leading-relaxed mb-8 max-w-md">
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

      {/* --- STRATEGIC ADVANTAGE (EXPERTIZĂ) --- */}
      <section id="expertiza" className="py-60 px-8 border-b border-white/5 relative bg-[#050505]">
         <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.08)_0%,_transparent_70%)] opacity-20 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-24 w-full">
            <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
               className="space-y-12 max-w-5xl mx-auto flex flex-col items-center justify-center text-center w-full"
            >
               <span className="text-[12px] font-black uppercase tracking-[0.7em] text-[var(--gold-600)] block text-center">PRESTIGIUL REZULTATELOR</span>
               <h2 className="text-7xl md:text-[8rem] lg:text-[11rem] font-black tracking-tighter text-white uppercase italic leading-[0.8] mx-auto text-center w-full">
                 Expertiză <br/> <span className="text-[var(--gold-400)] italic-gold">De Elită.</span>
               </h2>
               <p className="text-2xl md:text-3xl text-stone-400 font-serif leading-relaxed italic max-w-3xl mx-auto pt-10 text-center">
                 Cabinetul nostru nu oferă doar asistență legală; oferim certitudinea unei apărări construite pe fundamente academice solide și o experiență vastă în cele mai complexe jurisdicții.
               </p>
            </motion.div>

            <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
               className="grid sm:grid-cols-2 lg:grid-cols-4 gap-20 pt-24 border-t border-white/5"
            >
               {[
                 { icon: Zap, title: "Strategie Agresivă", desc: "Anticipăm mișcările adversarului și neutralizăm riscurile înainte ca ele să devină obstacole." },
                 { icon: Award, title: "Rigoare Academică", desc: "Fiecare speță este analizată prin prisma doctrinei de vârf și a jurisprudenței actualizate." },
                 { icon: Users, title: "Abordare Elitară", desc: "Garantăm discreție absolută și o comunicare privilegiată, adaptată nevoilor clienților premium." },
                 { icon: Globe, title: "Viziune Globală", desc: "Expertiza noastră depășește granițele locale, integrând standarde de drept european și internațional." }
               ].map((feat, i) => (
                 <motion.div variants={fadeInUp} key={i} className="group flex flex-col items-center text-center space-y-10">
                    <div className="w-32 h-32 rounded-full border-[0.5px] border-stone-800 flex items-center justify-center group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/10 transition-all duration-700 relative">
                       <feat.icon className="w-14 h-14 text-[var(--gold-600)] group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 rounded-full bg-[var(--gold-500)]/0 group-hover:bg-[var(--gold-500)]/5 blur-3xl transition-all duration-700" />
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white group-hover:text-[var(--gold-400)] transition-colors">{feat.title}</h4>
                       <p className="text-[12px] text-stone-500 leading-relaxed uppercase font-bold tracking-tight px-4 opacity-70 group-hover:opacity-100 transition-opacity">{feat.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </motion.div>
         </div>
      </section>

      {/* --- SERVICII (EDITORIAL GRID) --- */}
      <section id="servicii" className="py-60 px-8 bg-[#080808] border-b border-white/5">
         <div className="max-w-7xl mx-auto text-center space-y-12 mb-40 flex flex-col items-center justify-center w-full">
            <span className="text-[12px] font-black uppercase tracking-[0.7em] text-stone-600 block text-center">ARIA DE EXPERTIZĂ</span>
            <h3 className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-none mx-auto text-center w-full">Piloni <br/><span className="text-[var(--gold-500)]">Juridici.</span></h3>
            <div className="pt-16 flex justify-center w-full">
               <button className="btn-elite-wide min-w-[350px] justify-center mx-auto">
                  Descarcă Broșura Digitală
               </button>
            </div>
         </div>

         <div className="max-w-[1700px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-1 bg-white/5 border border-white/5 p-1 shadow-2xl">
            {services.map((service) => (
              <div key={service.id} className="group relative p-32 bg-[#080808] hover:bg-[#030303] transition-all duration-1000 text-center flex flex-col items-center overflow-hidden border border-transparent hover:border-white/5">
                 <div className="absolute -right-20 -top-20 w-80 h-80 bg-[var(--gold-500)]/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 
                 <div className="w-24 h-24 rounded-full border-[0.5px] border-stone-800 flex items-center justify-center text-[var(--gold-500)] mb-16 group-hover:scale-110 group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/5 transition-all duration-700">
                    <Scale className="w-10 h-10" />
                 </div>
                 
                 <h4 className="text-4xl font-serif text-white mb-10 group-hover:text-[var(--gold-400)] transition-colors italic uppercase tracking-tight duration-700 leading-none">{service.name}</h4>
                 <p className="text-lg text-stone-500 font-serif leading-loose mb-20 italic px-8">
                   {service.description || "Asistență de cel mai înalt nivel, calibrată pentru succes excepțional în situații juridice critice."}
                 </p>
                 <Link href={`/servicii/${service.slug}`} className="inline-flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] text-[var(--gold-600)] group-hover:text-white transition-all mt-auto py-8 border-t border-white/5 w-full">
                   Explorați Cazul <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-3 transition-transform duration-500" />
                 </Link>
              </div>
            ))}
         </div>
      </section>

      {/* --- LATEST ARTICLES (CENTERED SEO POWERHOUSE) --- */}
      <section id="articole" className="py-60 px-8 bg-[#030303] border-t border-white/5">
         <div className="max-w-7xl mx-auto space-y-32 flex flex-col items-center justify-center w-full text-center">
            <div className="text-center space-y-12 flex flex-col items-center justify-center w-full">
               <span className="text-[12px] font-black uppercase tracking-[0.7em] text-[var(--gold-600)] block text-center">PERSPECTIVE ȘI ANALIZE</span>
               <h3 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-none mx-auto mb-12 text-center w-full">Journal <br/> <span className="text-[var(--gold-500)]">Legislativ.</span></h3>
               <Link href="/blog" className="inline-flex items-center justify-center gap-6 text-[12px] font-black uppercase tracking-[0.5em] text-stone-400 hover:text-white transition-all border-b border-stone-800 pb-4 hover:border-[var(--gold-500)] mx-auto">
                  Vezi Toate Articolele <BookOpen className="w-6 h-6" />
               </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-16 w-full">
               {latestPosts.map((post) => (
                 <Link key={post.id} href={`/blog/${post.slug}`} className="group space-y-8 block text-center flex flex-col items-center">
                    <div className="aspect-[4/3] w-full overflow-hidden bg-stone-900 border border-stone-800 relative mb-8">
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
                    <h4 className="text-3xl font-serif text-white group-hover:text-[var(--gold-400)] transition-colors leading-tight italic px-4 text-center">
                       {post.title}
                    </h4>
                    <p className="text-sm text-stone-500 font-serif italic line-clamp-2 leading-relaxed px-6 text-center">
                       {post.excerpt}
                    </p>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Global Footer is now in layout.tsx */}
    </div>
  );
}
