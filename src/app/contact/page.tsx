"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, Mail, MapPin, Clock, Send, 
  ArrowRight, Shield, Globe, Award
} from "lucide-react";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    transition: { staggerChildren: 0.1 }
  }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Consultanță Generală",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const leadRef = doc(collection(db as any, "leads"));
      await setDoc(leadRef, {
        ...formData,
        createdAt: new Date().toISOString(),
        status: "NEW"
      });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "Consultanță Generală", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="bg-[#050505] text-white selection:bg-[var(--gold-500)] selection:text-black">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-60 pb-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(197,160,89,0.1)_0%,_transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-8">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-[11px] font-black uppercase tracking-[0.6em] text-[var(--gold-500)] block"
           >
             Contact Rapid
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85]"
           >
             Dialog <br/> <span className="text-stone-500">Privilegiat.</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-xl text-stone-400 font-serif italic max-w-2xl mx-auto pt-10"
           >
             Suntem aici pentru a vă oferi claritate și siguranță în cele mai complexe situații legale. Excelența începe cu prima discuție.
           </motion.p>
        </div>
      </section>

      {/* --- MAIN INTERFACE --- */}
      <section className="pb-60 px-8 relative z-10">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-start">
            
            {/* Left: Contact Info */}
            <motion.div 
               initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
               className="space-y-16"
            >
               <div className="space-y-12">
                  <motion.div variants={fadeInUp} className="flex gap-8 group">
                     <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-white/5 flex items-center justify-center text-[var(--gold-500)] group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/10 transition-all duration-500">
                        <Phone className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Asistență Telefonică</h4>
                        <p className="text-2xl font-serif italic text-white group-hover:text-[var(--gold-400)] transition-colors">+40 (740) 123 456</p>
                        <p className="text-[10px] font-bold text-stone-600 mt-2 uppercase tracking-widest">Luni - Vineri | 09:00 - 18:00</p>
                     </div>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="flex gap-8 group">
                     <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-white/5 flex items-center justify-center text-[var(--gold-500)] group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/10 transition-all duration-500">
                        <Mail className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Corespondență Digitală</h4>
                        <p className="text-2xl font-serif italic text-white group-hover:text-[var(--gold-400)] transition-colors">office@sps-asociatii.ro</p>
                        <p className="text-[10px] font-bold text-stone-600 mt-2 uppercase tracking-widest">Timp de răspuns estimat: 2 ore</p>
                     </div>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="flex gap-8 group">
                     <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-white/5 flex items-center justify-center text-[var(--gold-500)] group-hover:border-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/10 transition-all duration-500">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Sediul Central Brașov</h4>
                        <p className="text-2xl font-serif italic text-white group-hover:text-[var(--gold-400)] transition-colors">Strada Republicii, Nr. 12, Etaj 1</p>
                        <p className="text-[10px] font-bold text-stone-600 mt-2 uppercase tracking-widest italic">Punct Landmark: Lângă Piața Sfatului</p>
                     </div>
                  </motion.div>
               </div>

               <motion.div variants={fadeInUp} className="p-10 border border-white/5 bg-stone-900/30 backdrop-blur-md space-y-6">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-[var(--gold-600)] flex items-center gap-3">
                     <Shield className="w-4 h-4" /> Garanția Discreției
                  </h5>
                  <p className="text-sm text-stone-500 font-serif italic leading-relaxed">
                     Toate informațiile transmise sunt protejate de privilegiul avocat-client. Utilizăm criptare de nivel militar pentru securizarea datelor dumneavoastră sensibile.
                  </p>
               </motion.div>
            </motion.div>

            {/* Right: Form */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="bg-[#0a0a0a] border border-white/5 p-12 lg:p-20 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold-500)]/5 blur-[100px] pointer-events-none" />
               
               <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500 ml-1">Nume Complet</label>
                     <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-800 py-4 focus:border-[var(--gold-500)] outline-none text-xl font-serif italic text-white transition-all placeholder:text-stone-800" 
                        placeholder="Ex: Popescu Ionel"
                     />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-10">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500 ml-1">Email Oficial</label>
                        <input 
                           required
                           type="email" 
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full bg-transparent border-b border-stone-800 py-4 focus:border-[var(--gold-500)] outline-none text-xl font-serif italic text-white transition-all placeholder:text-stone-800" 
                           placeholder="office@companie.ro"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500 ml-1">Telefon Direct</label>
                        <input 
                           type="tel" 
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           className="w-full bg-transparent border-b border-stone-800 py-4 focus:border-[var(--gold-500)] outline-none text-xl font-serif italic text-white transition-all placeholder:text-stone-800" 
                           placeholder="+40..."
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500 ml-1">Aria de Interes</label>
                     <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-800 py-4 focus:border-[var(--gold-500)] outline-none text-xl font-serif italic text-white transition-all appearance-none cursor-pointer"
                     >
                        <option value="Consultanță Generală" className="bg-black">Consultanță Generală</option>
                        <option value="Drept Comercial" className="bg-black">Drept Comercial / Corporate</option>
                        <option value="Litigii & Arbitraj" className="bg-black">Litigii & Arbitraj</option>
                        <option value="Drept Penal" className="bg-black">Drept Penal Competitiv</option>
                        <option value="Real Estate" className="bg-black">Real Estate & Dezvoltări</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500 ml-1">Brief Mesaj</label>
                     <textarea 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-800 py-4 focus:border-[var(--gold-500)] outline-none text-xl font-serif italic text-white transition-all placeholder:text-stone-800 resize-none" 
                        placeholder="Vă rugăm să oferiți o scurtă descriere a speței..."
                     />
                  </div>

                  <button 
                     type="submit"
                     disabled={status === "loading"}
                     className="w-full py-8 bg-[var(--gold-500)] text-black text-[11px] font-black uppercase tracking-[0.6em] hover:bg-white transition-all flex items-center justify-center gap-6 group disabled:opacity-50"
                  >
                     {status === "loading" ? "Expediere..." : status === "success" ? "Trimis cu Succes" : "Solicită Consultanță"}
                     <Send className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
                  </button>
                  
                  {status === "error" && (
                     <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">Eroare la trimitere. Vă rugăm să încercați din nou.</p>
                  )}
               </form>
            </motion.div>

         </div>
      </section>

      {/* --- MAP SECTION --- */}
      <section className="h-[600px] w-full bg-stone-900 relative grayscale contrast-125 opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2789.043585350328!2d25.58661647653556!3d45.6427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b35b7ec656119f%3A0x6002f5a60e03e5c9!2sPia%C5%A3a%20Sfatului!5e0!3m2!1sro!2sro!4v1711970000000!5m2!1sro!2sro" 
            className="w-full h-full border-0" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
         />
         <div className="absolute inset-0 pointer-events-none border-y border-white/5" />
      </section>

   </div>
  );
}
