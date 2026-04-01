"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Menu, X, Phone } from "lucide-react";
import type { SiteSettings } from "@/types";

interface HeaderProps {
  settings: SiteSettings | null;
}

export default function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Echipa", href: "/#echipa" },
    { name: "Expertiză", href: "/#expertiză" },
    { name: "Servicii", href: "/#servicii" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-[60] w-full">
      <nav 
        className={`w-full transition-all duration-700 ${
          isScrolled 
            ? "bg-black/90 backdrop-blur-2xl border-b border-white/5 py-4" 
            : "bg-transparent py-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center text-center gap-8 relative w-full">
          
          {/* Logo Centerpiece */}
          <Link href="/" className="group flex flex-col items-center text-center transition-all duration-700 w-full justify-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.firmName} 
                className={`w-auto transition-all duration-700 ${isScrolled ? 'h-10' : 'h-16'} object-contain mx-auto`} 
              />
            ) : (
              <div className="flex flex-col items-center text-center justify-center">
                <div className={`flex items-center justify-center gap-4 transition-all duration-700 ${isScrolled ? 'scale-90' : 'scale-110'}`}>
                  <span className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-white italic leading-none block text-center">SPS</span>
                </div>
                <span className={`text-[10px] md:text-sm font-black tracking-[0.8em] uppercase text-[var(--gold-500)] mt-4 transition-opacity duration-700 block text-center ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                  ȘI ASOCIAȚII
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Symmetrical Menu */}
          <div className={`hidden lg:flex items-center justify-center gap-12 xl:gap-20 transition-all duration-700 w-full ${isScrolled ? 'opacity-100 mt-2' : 'opacity-100 mt-6'}`}>
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 hover:text-white transition-all relative group py-2"
              >
                {item.name}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-[var(--gold-500)] group-hover:w-full transition-all duration-700" />
              </Link>
            ))}
          </div>

          {/* Mobile Overlay Toggle & Quick Contact (Floating) */}
          <div className="lg:hidden absolute left-8 top-1/2 -translate-y-1/2 flex items-center">
             <button onClick={() => setMobileMenuOpen(true)} className="text-white hover:text-[var(--gold-500)] transition-colors p-2">
                <Menu className="w-7 h-7" />
             </button>
          </div>
          
          <div className="lg:hidden absolute right-8 top-1/2 -translate-y-1/2 flex items-center">
             <Link href="/contact" className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--gold-500)] hover:bg-[var(--gold-500)]/10 transition-all">
                <Phone className="w-5 h-5" />
             </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center p-12 text-center"
          >
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-8 right-8 text-stone-500 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-center gap-12">
               {menuItems.map((item, i) => (
                 <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                 >
                    <Link 
                      href={item.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-4xl font-serif italic text-white hover:text-[var(--gold-500)] transition-colors capitalize tracking-tight"
                    >
                      {item.name.toLowerCase()}
                    </Link>
                 </motion.div>
               ))}
               
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-12"
               >
                  <Link href="/contact" className="btn-elite-wide text-[10px]" onClick={() => setMobileMenuOpen(false)}>
                    Contact Rapid
                  </Link>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
