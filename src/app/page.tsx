"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Scale, Shield, Gavel, FileText, Phone, MapPin, 
  ChevronRight, ArrowRight, Star, Globe, Check
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, limit, getDocs } from "firebase/firestore";
import type { SiteSettings, LegalService, OfficeLocation } from "@/types";

// --- ANIMATION VARIANTS ---
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
    transition: { staggerChildren: 0.2 }
  }
};

const DEFAULT_HERO = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop";

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<LegalService[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const setDoc = await getDoc(doc(db, "settings", "global"));
        if (setDoc.exists()) setSettings(setDoc.data() as SiteSettings);

        const servSnap = await getDocs(query(collection(db, "services"), limit(6)));
        setServices(servSnap.docs.map(d => ({ id: d.id, ...d.data() } as LegalService)));

        const locSnap = await getDocs(collection(db, "office_locations"));
        setLocations(locSnap.docs.map(d => ({ id: d.id, ...d.data() } as OfficeLocation)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-stone-200 selection:bg-gold-500 selection:text-stone-950 font-sans">
      
      {/* --- FLOATING NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed top-0 inset-x-0 z-50 h-24 flex items-center justify-between px-8 md:px-16 lg:px-24 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm"
      >
        <Link href="/" className="flex items-center gap-3 group">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          ) : (
            <>
              <div className="w-10 h-10 rounded bg-stone-900 border border-stone-800 flex items-center justify-center">
                <Scale className="w-6 h-6 text-gold-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-[0.2em] uppercase leading-none text-white italic">AVOCAT</span>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gold-500">BRAȘOV</span>
              </div>
            </>
          )}
        </Link>
        <div className="hidden md:flex items-center gap-10">
           {['Expertiză', 'Servicii', 'Locații', 'Articole'].map((item) => (
             <Link key={item} href={`/#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-gold-400 transition-colors">
               {item}
             </Link>
           ))}
           <Link href="/contact" className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 transition-all rounded">
             Consultatie Gratuita
           </Link>
        </div>
      </motion.nav>

      {/* --- CINEMATIC HERO (DRAMATIC) --- */}
      <section className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden">
         {/* Background Image with Parallax */}
         <motion.div 
           style={{ y: y1 }}
           className="absolute inset-0 z-0"
         >
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#050505] z-10" />
           <div className="absolute inset-0 bg-black/30 z-10" />
           <img 
             src={settings?.heroImageUrl || DEFAULT_HERO} 
             alt="Legal Office Brașov" 
             className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]" 
           />
         </motion.div>

         <div className="relative z-20 text-center max-w-5xl px-8 space-y-8">
            <motion.div 
              style={{ opacity }}
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer}
            >
               <motion.span 
                 variants={fadeInUp}
                 className="block text-[11px] font-black uppercase tracking-[0.6em] text-gold-500 mb-6 italic"
               >
                 ELITE LEGAL PARTNERS
               </motion.span>
               <motion.h1 
                 variants={fadeInUp}
                 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tight mb-8"
               >
                 Justiție cu <br/> <motion.span className="italic text-gold-400">Prestigiu.</motion.span>
               </motion.h1>
               <motion.p 
                 variants={fadeInUp}
                 className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto font-light leading-relaxed mb-12"
               >
                 {settings?.firmDescription || "Apărăm drepturile și interesele clienților noștri cu o rigoare academică și o strategie juridică de neegalat în județul Brașov."}
               </motion.p>
               <motion.div 
                 variants={fadeInUp}
                 className="flex flex-col md:flex-row items-center justify-center gap-6"
               >
                  <Link href="/contact" className="group px-10 py-5 bg-gold-500 text-stone-950 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-gold-400 transition-all rounded shadow-2xl shadow-gold-500/10">
                    Programează Consultanță <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="px-10 py-5 border border-stone-800 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all rounded backdrop-blur-md">
                    Vezi Expertiza Noastră
                  </button>
               </motion.div>
            </motion.div>
         </div>

         {/* Bottom Scroll Indicator */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2, duration: 1 }}
           className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-stone-600"
         >
            <span className="text-[9px] font-black uppercase tracking-[0.5em] rotate-90 origin-left translate-x-3 mb-10">SCROLL</span>
            <div className="w-px h-24 bg-gradient-to-b from-stone-800 to-transparent" />
         </motion.div>
      </section>

      {/* --- CORE EXPERTISE (EDITORIAL LAYOUT) --- */}
      <section className="py-32 px-8 md:px-24 bg-[#050505]">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-10"
            >
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-600 flex items-center gap-3">
                 <div className="w-10 h-px bg-gold-600/30" /> DESPRE CABINET
               </span>
               <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight">
                 Protejăm ce <br/> contează <span className="italic italic-gold text-gold-500">cu adevărat.</span>
               </h2>
               <p className="text-lg text-stone-400 font-light leading-loose">
                 Cu o prezență solidă în Brașov, cabinetul nostru redefinește standardele avocaturii moderne. Combinăm experiența acumulată în sute de procese cu o abordare inovativă și personalizată pentru fiecare speță juridică.
               </p>
               <div className="grid sm:grid-cols-2 gap-8 pt-6">
                  {[
                    { title: "Integritate", desc: "Etica este fundamentul oricărei acțiuni juridice." },
                    { title: "Strategie", desc: "Anticipăm mișcările adversarului pentru victorie." },
                    { title: "Rezultate", desc: "Rata de succes ne confirmă valoarea academică." },
                    { title: "Confidențialitate", desc: "Secretul profesional este absolut și garantat." }
                  ].map((feat, i) => (
                    <div key={i} className="space-y-2">
                       <h4 className="text-sm font-black uppercase tracking-widest text-white">{feat.title}</h4>
                       <p className="text-[11px] text-stone-500 leading-relaxed uppercase">{feat.desc}</p>
                    </div>
                  ))}
               </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded overflow-hidden shadow-2xl group"
            >
               <div className="absolute inset-0 bg-gold-500/10 mix-blend-overlay z-10" />
               <img 
                 src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2670&auto=format&fit=crop" 
                 alt="Lawyer Interior" 
                 className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[3s]" 
               />
               <div className="absolute bottom-10 -left-10 bg-stone-900 border border-stone-800 p-10 z-20 shadow-2xl max-w-sm hidden md:block">
                  <div className="flex items-center gap-4 mb-4">
                     <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Excelență Recunoscută</span>
                  </div>
                  <p className="text-sm text-white font-serif italic mb-4 leading-relaxed">
                    "O forță juridică de neegalat. Modul în care au gestionat litigiul nostru comercial a fost pur și simplu magistral."
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gold-500">— Director Executiv, Brașov Ind</span>
               </div>
            </motion.div>
         </div>
      </section>

      {/* --- PRACTICE AREAS (GRID) --- */}
      <section className="py-32 px-8 md:px-24 border-t border-stone-900">
         <div className="max-w-7xl mx-auto text-center mb-24 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-600">DOMENII DE ACTIVITATE</span>
            <h3 className="text-5xl md:text-7xl font-serif text-white tracking-tight italic">Expertiză Multidisciplinară</h3>
         </div>

         <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div 
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="group relative p-10 bg-[#0a0a0a] border border-stone-900 hover:border-gold-500/30 transition-all rounded overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                 <div className="w-12 h-12 rounded bg-stone-900 border border-stone-800 flex items-center justify-center text-gold-500 mb-8 group-hover:scale-110 transition-transform">
                   <Gavel className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-serif text-white mb-4 group-hover:text-gold-400 transition-colors">{service.name}</h4>
                 <p className="text-sm text-stone-500 font-light leading-relaxed mb-8 line-clamp-3">
                   {service.description || "Servicii juridice specializate adaptate nevoilor dumneavoastră individuale sau corporate în Brașov și împrejurimi."}
                 </p>
                 <Link href={`/servicii/${service.slug}`} className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-stone-400 group-hover:text-gold-500 transition-all">
                   Detaliere Serviciu <ArrowRight className="w-3 h-3" />
                 </Link>
              </motion.div>
            ))}
         </div>
         
         <div className="mt-20 text-center">
            <button className="px-12 py-6 border border-stone-800 text-stone-400 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black hover:border-white transition-all rounded">
               Vezi Toate Serviciile Noastre
            </button>
         </div>
      </section>

      {/* --- LOCATIONS (MULTI-MAP FEEL) --- */}
      <section className="py-32 px-8 md:px-24 bg-stone-950">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3 space-y-10">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-600">PREZENȚĂ LOCALĂ</span>
               <h3 className="text-4xl md:text-6xl font-serif text-white leading-tight italic">Unde ne găsești <br/> în Brașov.</h3>
               <p className="text-stone-500 text-sm font-light leading-loose">
                 Am extins prezența noastră pentru a fi mai aproape de tine. Oferim consultanță în principalele puncte strategice ale județului.
               </p>
               <div className="space-y-6">
                  {locations.map((loc, i) => (
                    <div key={i} className="p-6 rounded border border-stone-900 bg-black/40 hover:border-gold-500/20 transition-all group">
                       <h5 className="text-[11px] font-black uppercase tracking-widest text-white mb-2 group-hover:text-gold-500 transition-colors">{loc.name}</h5>
                       <p className="text-xs text-stone-600 mb-1">{loc.address}</p>
                       <p className="text-xs text-gold-500/70 font-bold">{loc.phone}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="lg:w-2/3 aspect-video rounded overflow-hidden border border-stone-900 shadow-2xl relative grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               <div className="absolute inset-0 flex items-center justify-center bg-stone-900/50 backdrop-blur-[2px] z-10 pointer-events-none">
                  <div className="flex flex-col items-center gap-4 text-center p-10">
                     <MapPin className="w-12 h-12 text-gold-500 animate-bounce" />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">REȚEA SEDII BRAȘOV</p>
                  </div>
               </div>
               <iframe 
                 src={settings?.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d174116.73228833958!2d25.437145899999998!3d45.6521799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b35c7ee0dfb819%3A0x153288a7605d8f78!2zQmRvdG92LCBCcmHFm292!5e0!3m2!1sen!2sro!4v1711910000000!5m2!1sen!2sro"} 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen 
                 loading="lazy"
               />
            </div>
         </div>
      </section>

      {/* --- FOOTER (MINIMAL PRO) --- */}
      <footer className="py-20 px-8 md:px-24 border-t border-stone-900 text-center">
         <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col items-center gap-6">
                <div className="w-14 h-14 rounded-full border border-stone-800 flex items-center justify-center">
                   <Scale className="w-7 h-7 text-gold-500" />
                </div>
                <h4 className="text-2xl font-serif text-white italic">Cabinet de Avocatură Brașov</h4>
                <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-stone-600">
                   <Link href="/politica-confidentialitate" className="hover:text-gold-500 transition-colors">Confidențialitate</Link>
                   <Link href="/termeni-si-conditii" className="hover:text-gold-500 transition-colors">Termeni</Link>
                   <Link href="/contact" className="hover:text-gold-500 transition-colors">Contact</Link>
                   <Link href="/admin" className="hover:text-gold-500 transition-colors">Administrare</Link>
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-800">
               © {new Date().getFullYear()} {settings?.firmName || "Cabinet de Avocatură"}. Toate drepturile rezervate.
            </p>
         </div>
      </footer>
    </div>
  );
}
