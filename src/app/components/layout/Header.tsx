"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import type { SiteSettings } from "@/types";

interface HeaderProps {
  settings: SiteSettings | null;
}

export default function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Echipa", href: "/#echipa" },
    { name: "Expertiză", href: "/#expertiza" },
    { name: "Servicii", href: "/#servicii" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-[60] w-full">
      <nav
        className={`w-full transition-all duration-700 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-2xl border-b border-white/5 py-3 shadow-2xl shadow-black/50"
            : "bg-transparent py-10"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-10 flex flex-col items-center justify-center gap-8 relative">

          {/* === LOGO (Perfectly Centered) === */}
          <Link href="/" className="flex flex-col items-center justify-center group">
            <div className="flex flex-col items-center text-center">
              <span
                className={`font-black tracking-tighter uppercase text-white italic leading-[0.7] transition-all duration-700 group-hover:text-[var(--gold-400)] ${
                  isScrolled ? "text-4xl" : "text-6xl md:text-7xl"
                }`}
              >
                SPS
              </span>
              <span
                className={`font-black uppercase text-[var(--gold-500)] tracking-[0.8em] transition-all duration-700 ${
                  isScrolled ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100 max-h-12 mt-3 text-[11px]"
                }`}
              >
                ȘI ASOCIAȚII
              </span>
            </div>
          </Link>

          {/* === DESKTOP NAV (Centered below logo) === */}
          <div className={`hidden lg:flex items-center justify-center gap-16 transition-all duration-700 ${isScrolled ? "mt-0" : "mt-4"}`}>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[11px] font-black uppercase tracking-[0.6em] text-white/50 hover:text-white transition-all duration-500 group py-2"
              >
                {item.name}
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-[var(--gold-500)] group-hover:w-full transition-all duration-700 shadow-[0_0_8px_var(--gold-500)]" />
              </Link>
            ))}
          </div>

          {/* === MOBILE: Hamburger left, Phone right === */}
          <div className="lg:hidden absolute left-6 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-white p-3 hover:text-[var(--gold-500)] transition-colors bg-white/5 border border-white/5 rounded-sm"
              aria-label="Open Menu"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
          <div className="lg:hidden absolute right-6 top-1/2 -translate-y-1/2">
            <Link
              href="/contact"
              className="w-12 h-12 flex items-center justify-center rounded-sm border border-white/10 bg-white/5 text-[var(--gold-500)] hover:bg-[var(--gold-500)]/20 transition-all"
              aria-label="Contact"
            >
              <Phone className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </nav>


      {/* === MOBILE MENU OVERLAY === */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center p-12 text-center"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-stone-500 hover:text-white transition-colors"
              aria-label="Close Menu"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Logo inside mobile menu */}
            <div className="mb-16 flex flex-col items-center">
              <span className="text-5xl font-black tracking-tighter uppercase text-white italic">SPS</span>
              <span className="text-xs font-black uppercase tracking-[0.5em] text-[var(--gold-500)] mt-2">ȘI ASOCIAȚII</span>
            </div>

            <div className="flex flex-col items-center gap-10">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-serif italic text-white hover:text-[var(--gold-500)] transition-colors capitalize"
                  >
                    {item.name.toLowerCase()}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--gold-500)] text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-[var(--gold-400)] transition-all"
                >
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
