"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Scale, FileText, ArrowRight,
  Zap, Award, Users, Globe, BookOpen, Calendar, Briefcase
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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
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
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [activeLawyer, setActiveLawyer] = useState<string | null>(null);

  const displayAttorneys = attorneys.length >= 3 ? attorneys.slice(0, 3) : FALLBACK_ATTORNEYS;

  return (
    <div className="w-full bg-[#050505] text-stone-200 font-sans overflow-x-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ y: yParallax }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#050505] z-10" />
          <img
            src={settings?.heroImageUrl || DEFAULT_HERO}
            alt="Cabinet Avocat Brașov SPS și Asociații"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Hero Content - Perfectly Centered */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center">
          <motion.div
            style={{ opacity: heroOpacity }}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center gap-8 w-full"
          >
            {/* Eyebrow Label */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              <div className="w-10 h-px bg-[var(--gold-500)]/60" />
              <span className="text-xs font-black uppercase tracking-[0.5em] text-[var(--gold-500)]">
                {settings?.firmName || "SPS ȘI ASOCIAȚII"}
              </span>
              <div className="w-10 h-px bg-[var(--gold-500)]/60" />
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black text-white leading-tight tracking-tight uppercase text-center"
            >
              Justiție de{" "}
              <span className="italic text-[var(--gold-400)]">Prestigiu.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto font-serif italic leading-relaxed text-center"
            >
              {settings?.homeSubtitle || 
               "Apărăm drepturile și interesele clienților noștri cu o rigoare academică și o strategie juridică de neegalat în județul Brașov."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[var(--gold-500)] text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-[var(--gold-400)] transition-all duration-500 group w-full sm:w-auto shadow-2xl shadow-[var(--gold-500)]/20"
              >
                {settings?.ctaPrimary || "Solicită Consultanță"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
              <Link
                href="#expertiza"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-white/20 text-stone-300 text-xs font-black uppercase tracking-[0.4em] hover:border-white/60 hover:text-white transition-all duration-500 w-full sm:w-auto"
              >
                {settings?.ctaSecondary || "Explorați Expertiza"}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <div className="w-px h-16 bg-gradient-to-b from-[var(--gold-500)] to-transparent" />
        </div>
      </section>

      {/* ===== ECHIPA SECTION ===== */}
      <section id="echipa" className="w-full bg-[#030303] border-b border-white/5 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          
          {/* Section Header */}
          <div className="mb-16 flex flex-col items-center gap-6">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-[var(--gold-600)]">LIDERII APĂRĂRII</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase italic leading-tight text-center">
              Avocații <span className="text-[var(--gold-500)]">Tăi.</span>
            </h2>
            <p className="text-base md:text-lg text-stone-500 font-serif italic max-w-2xl leading-relaxed text-center">
              Echipa noastră, definită prin putere strategică, excelență academică și o viziune legală neclintită.
            </p>
          </div>

          {/* Attorney Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {displayAttorneys.map((attorney) => (
              <motion.div
                key={attorney.id}
                onMouseEnter={() => setActiveLawyer(attorney.id)}
                onMouseLeave={() => setActiveLawyer(null)}
                onClick={() => setActiveLawyer(activeLawyer === attorney.id ? null : attorney.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[500px] overflow-hidden cursor-pointer group rounded-sm"
              >
                {/* Photo */}
                <img
                  src={attorney.avatarUrl || DEFAULT_HERO}
                  alt={attorney.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700"
                  style={{
                    filter: activeLawyer === attorney.id 
                      ? 'grayscale(0%) contrast(100%)' 
                      : 'grayscale(100%) contrast(110%) brightness(0.5)',
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className={`transition-all duration-500 ${activeLawyer === attorney.id ? 'translate-y-0' : 'translate-y-2'}`}>
                    <h3 className="text-2xl md:text-3xl font-black uppercase italic text-white tracking-tight mb-1">
                      {attorney.name}
                    </h3>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--gold-500)] mb-4">
                      {attorney.role === 'OWNER' ? 'Partener Coordonator' : (attorney.role || 'Avocat Senior')}
                    </p>
                    
                    <AnimatePresence>
                      {activeLawyer === attorney.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm font-serif italic text-stone-300 leading-relaxed mb-4 max-w-xs">
                            {attorney.bio}
                          </p>
                          {(attorney.practiceAreas?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {attorney.practiceAreas!.slice(0, 3).map((area: string) => (
                                <div key={area} className="flex items-center gap-1.5 px-3 py-1 border border-white/20 text-[9px] font-black tracking-widest uppercase text-white backdrop-blur-sm">
                                  <Briefcase className="w-2.5 h-2.5 text-[var(--gold-500)]" />
                                  {area}
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

      {/* ===== EXPERTIZĂ SECTION ===== */}
      <section id="expertiza" className="w-full bg-[#050505] border-b border-white/5 py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col items-center gap-6 mb-24 w-full max-w-4xl"
          >
            <motion.span variants={fadeInUp} className="text-xs font-black uppercase tracking-[0.5em] text-[var(--gold-600)]">
              PRESTIGIUL REZULTATELOR
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase italic leading-tight text-center">
              Expertiză <span className="text-[var(--gold-400)]">De Elită.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-stone-400 font-serif leading-relaxed italic max-w-2xl text-center">
              Cabinetul nostru nu oferă doar asistență legală; oferim certitudinea unei apărări construite pe fundamente academice solide și o experiență vastă în cele mai complexe jurisdicții.
            </motion.p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full border-t border-white/5 pt-16"
          >
            {[
              { icon: Zap, title: "Strategie Agresivă", desc: "Anticipăm mișcările adversarului și neutralizăm riscurile înainte ca ele să devină obstacole." },
              { icon: Award, title: "Rigoare Academică", desc: "Fiecare speță este analizată prin prisma doctrinei de vârf și a jurisprudenței actualizate." },
              { icon: Users, title: "Abordare Elitară", desc: "Garantăm discreție absolută și o comunicare privilegiată, adaptată nevoilor clienților premium." },
              { icon: Globe, title: "Viziune Globală", desc: "Expertiza noastră depășește granițele locale, integrând standarde de drept european și internațional." }
            ].map((feat, i) => (
              <motion.div
                variants={fadeInUp}
                key={i}
                className="group flex flex-col items-center text-center gap-6 p-6 hover:bg-white/2 transition-all duration-500 rounded-sm"
              >
                <div className="w-20 h-20 rounded-full border border-stone-800 flex items-center justify-center group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/10 transition-all duration-500">
                  <feat.icon className="w-9 h-9 text-[var(--gold-600)] group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white group-hover:text-[var(--gold-400)] transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed uppercase font-semibold tracking-wider">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICII SECTION ===== */}
      <section id="servicii" className="w-full bg-[#080808] border-b border-white/5 py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Section Header */}
          <div className="flex flex-col items-center gap-6 mb-16">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-600">ARIA DE EXPERTIZĂ</span>
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase italic leading-tight text-center">
              Piloni <span className="text-[var(--gold-500)]">Juridici.</span>
            </h3>
          </div>

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px w-full bg-white/5 border border-white/5">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative p-12 bg-[#080808] hover:bg-[#030303] transition-all duration-700 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full border border-stone-800 flex items-center justify-center text-[var(--gold-500)] mb-8 group-hover:scale-110 group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/5 transition-all duration-500">
                    <Scale className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-serif text-white mb-4 group-hover:text-[var(--gold-400)] transition-colors italic uppercase tracking-tight leading-tight">
                    {service.name}
                  </h4>
                  <p className="text-sm text-stone-500 font-serif leading-relaxed italic mb-8">
                    {service.description || "Asistență de cel mai înalt nivel, calibrată pentru succes excepțional în situații juridice critice."}
                  </p>
                  <Link
                    href={`/servicii/${service.slug}`}
                    className="inline-flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-[var(--gold-600)] group-hover:text-white transition-all mt-auto pt-6 border-t border-white/5 w-full"
                  >
                    Explorați Cazul <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-600 italic font-serif text-lg">Serviciile vor fi disponibile în curând.</p>
          )}
        </div>
      </section>

      {/* ===== BLOG SECTION ===== */}
      <section id="articole" className="w-full bg-[#030303] py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Section Header */}
          <div className="flex flex-col items-center gap-6 mb-16">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-[var(--gold-600)]">PERSPECTIVE ȘI ANALIZE</span>
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase italic leading-tight text-center">
              Journal <span className="text-[var(--gold-500)]">Legislativ.</span>
            </h3>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-stone-400 hover:text-white transition-all border-b border-stone-800 pb-2 hover:border-[var(--gold-500)]"
            >
              Vezi Toate Articolele <BookOpen className="w-4 h-4" />
            </Link>
          </div>

          {/* Blog Grid */}
          {latestPosts.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-10 w-full">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-stone-900 border border-stone-800 relative mb-6">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-10 h-10 text-stone-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-6 py-3 border border-[var(--gold-500)] text-xs font-black uppercase tracking-widest text-[var(--gold-400)]">
                        Citește
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--gold-600)] mb-3">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString('ro-RO')}
                  </div>
                  <h4 className="text-xl font-serif text-white group-hover:text-[var(--gold-400)] transition-colors leading-tight italic">
                    {post.title}
                  </h4>
                  <p className="text-xs text-stone-500 font-serif italic line-clamp-2 leading-relaxed mt-2">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-stone-600 italic font-serif text-lg">Articolele vor fi disponibile în curând.</p>
          )}
        </div>
      </section>

    </div>
  );
}
