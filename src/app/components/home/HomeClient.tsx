"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Scale, FileText, ArrowRight,
  Zap, Award, Users, Globe, BookOpen, Calendar
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
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const DEFAULT_HERO = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop";

const FALLBACK_ATTORNEYS = [
  { 
    id: '1', 
    name: 'Victor Mănescu', 
    role: 'Partener Coordonator', 
    bio: 'Experiență de peste 15 ani în litigii comerciale complexe și arbitraj internațional. Strateg vizionar în apărare penală a afacerilor.', 
    avatarUrl: '/images/lawyer1.png', 
    practiceAreas: ['Litigii', 'Drept Comercial', 'Arbitraj'] 
  },
  { 
    id: '2', 
    name: 'Elena Popescu', 
    role: 'Avocat Partener Senior', 
    bio: 'Expert recunoscut în fuziuni, achiziții și drept corporatist. Asigură excelența juridică pentru corporații multinaționale și investitori strategici.', 
    avatarUrl: '/images/lawyer2.png', 
    practiceAreas: ['Corporate', 'Business Law', 'M&A'] 
  },
  { 
    id: '3', 
    name: 'Alexandru Istrate', 
    role: 'Strateg Juridic', 
    bio: 'Conduce departamentul de real estate și negocieri strategice. Cunoscut pentru determinarea și acuratețea cu care securizează portofolii de referință.', 
    avatarUrl: '/images/lawyer3.png', 
    practiceAreas: ['Real Estate', 'Executări', 'Negocieri'] 
  },
];

export default function HomeClient({ settings, services, locations, latestPosts, attorneys }: HomeClientProps) {
  // Use locations if needed or keep it to satisfy props.
  const _locations = locations; // Suppress unused var error playfully or just ignore next comment
  
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [activeLawyer, setActiveLawyer] = useState<string | null>(null);

  const displayAttorneys = attorneys.length >= 3 ? attorneys.slice(0, 3) : FALLBACK_ATTORNEYS;

  return (
    <div className="w-full bg-[#050505] text-stone-200 font-sans overflow-x-hidden flex flex-col items-center">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        
        {/* Background Image with Parallax */}
        <motion.div style={{ y: yParallax }} className="absolute inset-0 z-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505] z-10" />
          <img
            src={settings?.heroImageUrl || DEFAULT_HERO}
            alt="Cabinet Avocat Brașov SPS și Asociații"
            className="w-full h-full object-cover grayscale brightness-[0.7] contrast-[1.1]"
          />
        </motion.div>

        {/* Hero Content - Perfectly Centered */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center select-none">
          <motion.div
            style={{ opacity: heroOpacity }}
            initial="hidden"
            animate="visible"
            variants={staggerContainer as any}
            className="flex flex-col items-center gap-8 w-full"
          >
            {/* Eyebrow Label */}
            <motion.div variants={fadeInUp as any} className="flex items-center gap-6">
              <div className="w-12 h-px bg-[var(--gold-500)]/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--gold-500)]">
                {settings?.firmName || "BAROUL BRAȘOV • SPS ȘI ASOCIAȚII"}
              </span>
              <div className="w-12 h-px bg-[var(--gold-500)]/40" />
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={fadeInUp as any}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-black text-white leading-[0.9] tracking-tighter uppercase text-center"
            >
              Justiție de<br />
              <span className="italic text-[var(--gold-400)] ml-4">Prestigiu.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp as any}
              className="text-lg sm:text-xl md:text-2xl text-stone-400 max-w-3xl mx-auto font-serif italic leading-relaxed text-center"
            >
              {settings?.homeSubtitle || 
               "Apărăm drepturile și interesele clienților noștri cu o rigoare academică și o strategie juridică de neegalat în România."}
            </motion.p>

            {/* CTA Buttons - Premium Romanian Law Design */}
            <motion.div
              variants={fadeInUp as any}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl mx-auto pt-6"
            >
              <Link
                href="/contact"
                className="relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#0a0a0a] text-[var(--gold-500)] text-xs font-black uppercase tracking-[0.3em] overflow-hidden group border border-white/10 shadow-xl"
              >
                {/* Romanian Flag subtle accent line on top */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#002B7F] via-[#FCE300] to-[#CE1126] opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-4">
                  {settings?.ctaPrimary || "Solicită Consultanță"}
                  <Scale className="w-4 h-4 group-hover:rotate-12 transition-transform duration-500" />
                </span>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[var(--gold-500)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <Link
                href="#expertiza"
                className="inline-flex items-center justify-center gap-4 px-10 py-5 border border-stone-800 text-stone-300 text-xs font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:border-stone-600 transition-all duration-500 backdrop-blur-md"
              >
                {settings?.ctaSecondary || "Explorați Expertiza"}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <span className="text-[9px] font-black uppercase tracking-[1em] text-stone-600 rotate-90 mb-4">SCROLL</span>
          <div className="w-px h-24 bg-gradient-to-b from-[var(--gold-500)] to-transparent" />
        </div>
      </section>

      {/* ===== ECHIPA SECTION ===== */}
      <section id="echipa" className="w-full bg-[#030303] border-y border-white/5 py-32 overflow-hidden flex flex-col items-center justify-center select-none">
        <div className="w-full max-w-[1400px] mx-auto px-6 flex flex-col items-center">
          
          {/* Section Header */}
          <div className="mb-24 flex flex-col items-center gap-8 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)]">LIDERII APĂRĂRII</span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
              Avocații <span className="text-[var(--gold-500)]">Tăi.</span>
            </h2>
            <p className="text-xl md:text-2xl text-stone-500 font-serif italic max-w-3xl leading-relaxed">
              Echipa noastră, definită prin putere strategică, excelență academică și o viziune legală neclintită.
            </p>
          </div>

          {/* Attorney Flexible Grid (Propagation Effect) */}
          <div className="flex flex-col md:flex-row w-full h-[750px] gap-2 rounded-sm overflow-hidden">
            {displayAttorneys.map((attorney) => (
              <motion.div
                key={attorney.id}
                onMouseEnter={() => setActiveLawyer(attorney.id)}
                onMouseLeave={() => setActiveLawyer(null)}
                animate={{ 
                  flex: activeLawyer === attorney.id ? 4 : 1,
                  filter: activeLawyer && activeLawyer !== attorney.id ? 'grayscale(1) brightness(0.4)' : 'grayscale(0) brightness(1)'
                }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] } as any}
                className="relative h-full overflow-hidden cursor-pointer group border-x border-white/5 bg-stone-900"
              >
                {/* Photo */}
                <motion.img
                  src={attorney.avatarUrl || DEFAULT_HERO}
                  alt={attorney.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000"
                  style={{
                    filter: activeLawyer === attorney.id 
                      ? 'contrast(100%) brightness(0.9)' 
                      : 'grayscale(100%) contrast(120%) brightness(0.4)',
                    scale: activeLawyer === attorney.id ? 1.05 : 1
                  }}
                />
                
                {/* Vertical Text for Inactive State */}
                <AnimatePresence mode="wait">
                  {activeLawyer !== attorney.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
                    >
                      <span className="whitespace-nowrap text-5xl lg:text-8xl font-black uppercase italic text-stone-700/30 rotate-90 tracking-tighter mix-blend-overlay">
                        {attorney.name.split(' ')[0]}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center">
                  <motion.div 
                    animate={{ 
                      y: activeLawyer === attorney.id ? 0 : 40,
                      opacity: activeLawyer === attorney.id ? 1 : 0 
                    }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center"
                  >
                    <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase italic text-white tracking-tighter mb-4 leading-none select-none">
                      {attorney.name}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-500)] mb-8 select-none">
                      {attorney.role === 'OWNER' ? 'Partener Coordonator' : (attorney.role || 'Avocat Senior')}
                    </p>
                    
                    {/* Practice Areas Moved UP and ENLARGED */}
                    {(attorney.practiceAreas?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {attorney.practiceAreas!.slice(0, 3).map((area: string) => (
                           <span key={area} className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-stone-200 border-b-2 border-[var(--gold-500)] pb-1 select-none">
                             {area}
                           </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-lg md:text-xl font-serif italic text-stone-400 leading-relaxed max-w-lg select-none">
                      {attorney.bio}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERTIZĂ SECTION ===== */}
      <section id="expertiza" className="w-full bg-[#050505] border-b border-white/5 py-32 px-6 flex flex-col items-center justify-center select-none">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">
          
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer as any}
            className="flex flex-col items-center gap-8 mb-32 text-center"
          >
            <motion.span variants={fadeInUp as any} className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)]">
              PRESTIGIUL REZULTATELOR
            </motion.span>
            <motion.h2 variants={fadeInUp as any} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
              Expertiză <span className="text-[var(--gold-400)]">De Elită.</span>
            </motion.h2>
            <motion.p variants={fadeInUp as any} className="text-xl md:text-2xl text-stone-400 font-serif leading-relaxed italic max-w-3xl">
              Cabinetul nostru nu oferă doar asistență legală; oferim certitudinea unei apărări construite pe fundamente academice solide și o experiență vastă în cele mai complexe jurisdicții.
            </motion.p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer as any}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-16 w-full pt-16 border-t border-white/5"
          >
            {[
              { icon: Zap, title: "Strategie Agresivă", desc: "Anticipăm mișcările adversarului și neutralizăm riscurile înainte ca ele să devină obstacole." },
              { icon: Award, title: "Rigoare Academică", desc: "Fiecare speță este analizată prin prisma doctrinei de vârf și a jurisprudenței actualizate." },
              { icon: Users, title: "Abordare Elitară", desc: "Garantăm discreție absolută și o comunicare privilegiată, adaptată nevoilor clienților premium." },
              { icon: Globe, title: "Viziune Globală", desc: "Expertiza noastră depășește granițele locale, integrând standarde de drept european și internațional." }
            ].map((feat, i) => (
              <motion.div
                variants={fadeInUp as any}
                key={i}
                className="group flex flex-col items-center text-center gap-8"
              >
                <div className="w-20 h-20 rounded-full border border-stone-900 flex items-center justify-center group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/5 transition-all duration-700 relative">
                  <div className="absolute inset-0 rounded-full bg-[var(--gold-500)]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <feat.icon className="w-8 h-8 text-[var(--gold-600)] group-hover:scale-110 group-hover:text-[var(--gold-400)] transition-all duration-700 relative z-10" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white group-hover:text-[var(--gold-400)] transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed uppercase font-semibold tracking-widest max-w-[200px]">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICII SECTION ===== */}
      <section id="servicii" className="w-full bg-[#080808] border-b border-white/5 py-24 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">
          
          {/* Section Header */}
          <div className="flex flex-col items-center gap-8 mb-24 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600">ARIA DE EXPERTIZĂ</span>
            <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
              Piloni <span className="text-[var(--gold-500)]">Juridici.</span>
            </h3>
          </div>

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px w-full bg-white/5 border border-white/5">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative p-14 bg-[#080808] hover:bg-[#030303] transition-all duration-1000 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full border border-stone-900 flex items-center justify-center text-[var(--gold-500)] mb-10 group-hover:scale-110 group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/5 transition-all duration-1000">
                    <Scale className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-serif text-white mb-5 group-hover:text-[var(--gold-400)] transition-colors italic uppercase tracking-tighter leading-tight">
                    {service.name}
                  </h4>
                  <p className="text-sm text-stone-500 font-serif leading-relaxed italic mb-10 max-w-xs px-4">
                    {service.description || "Asistență de cel mai înalt nivel, calibrată pentru succes excepțional în situații juridice critice."}
                  </p>
                  <Link
                    href={`/servicii/${service.slug}`}
                    className="inline-flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold-600)] group-hover:text-white transition-all mt-auto pt-8 border-t border-white/5 w-full"
                  >
                    Explorați Cazul <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-700" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-600 italic font-serif text-xl">Serviciile vor fi disponibile în curând.</p>
          )}
        </div>
      </section>

      {/* ===== BLOG SECTION ===== */}
      <section id="articole" className="w-full bg-[#030303] py-24 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">
          
          {/* Section Header */}
          <div className="flex flex-col items-center gap-8 mb-24 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)]">PERSPECTIVE ȘI ANALIZE</span>
            <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
              Journal <span className="text-[var(--gold-500)]">Legislativ.</span>
            </h3>
            <Link
              href="/blog"
              className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 hover:text-white transition-all border-b border-stone-800 pb-3 hover:border-[var(--gold-500)]"
            >
              Vezi Toate Articolele <BookOpen className="w-4 h-4" />
            </Link>
          </div>

          {/* Blog Grid */}
          {latestPosts.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-12 w-full">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col items-center text-center px-4"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-stone-950 border border-white/5 relative mb-8">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-10 h-10 text-stone-800" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-6 py-3 border border-[var(--gold-500)] text-[10px] font-black uppercase tracking-[0.5em] text-[var(--gold-400)]">
                        Citește
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold-600)] mb-4">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString('ro-RO')}
                  </div>
                  <h4 className="text-xl md:text-2xl font-serif text-white group-hover:text-[var(--gold-400)] transition-colors leading-tight italic uppercase tracking-tighter text-center">
                    {post.title}
                  </h4>
                  <p className="text-xs md:text-sm text-stone-500 font-serif italic line-clamp-2 leading-relaxed mt-4 max-w-sm text-center">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-stone-600 italic font-serif text-xl">Articolele vor fi disponibile în curând.</p>
          )}
        </div>
      </section>

    </div>
  );
}
