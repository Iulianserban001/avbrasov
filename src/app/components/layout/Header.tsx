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
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4" 
            : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-8 md:px-16 flex flex-col items-center gap-6">
          
          {/* Logo Centerpiece */}
          <Link href="/" className="group flex flex-col items-center transition-all duration-700">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.firmName} 
                className={`w-auto transition-all duration-700 ${isScrolled ? 'h-8' : 'h-14'} object-contain`} 
              />
            ) : (
              <div className="flex flex-col items-center">
                <div className={`flex items-center gap-4 transition-all duration-700 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                  <span className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white italic leading-none">SPS</span>
                </div>
                <span className={`text-[10px] md:text-xs font-black tracking-[0.6em] uppercase text-[var(--gold-500)] mt-2 transition-opacity duration-700 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                  ȘI ASOCIAȚII
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Symmetrical Menu */}
          <div className={`hidden lg:flex items-center justify-center gap-16 transition-all duration-700 ${isScrolled ? 'opacity-100 mt-0' : 'opacity-100 mt-2'}`}>
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-white transition-all relative group"
              >
                {item.name}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-[var(--gold-500)] group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </div>

          {/* Mobile Overlay Toggle & Quick Contact (Floating) */}
          <div className="lg:hidden absolute left-8 top-1/2 -translate-y-1/2">
             <button onClick={() => setMobileMenuOpen(true)} className="text-white hover:text-[var(--gold-500)] transition-colors">
                <Menu className="w-6 h-6" />
             </button>
          </div>
          
          <div className="lg:hidden absolute right-8 top-1/2 -translate-y-1/2">
             <Link href="/contact" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--gold-500)]">
                <Phone className="w-4 h-4" />
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
