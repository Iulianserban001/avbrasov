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
        className={`w-full transition-all duration-500 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-xl border-b border-white/10 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-4 relative">

          {/* === LOGO (Centered) === */}
          <Link href="/" className="flex flex-col items-center justify-center">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.firmName || "SPS și Asociații"}
                className={`w-auto object-contain transition-all duration-500 mx-auto ${isScrolled ? "h-8" : "h-12"}`}
              />
            ) : (
              <div className="flex flex-col items-center text-center">
                <span
                  className={`font-black tracking-tighter uppercase text-white italic leading-none transition-all duration-500 ${
                    isScrolled ? "text-3xl" : "text-4xl md:text-5xl"
                  }`}
                >
                  SPS
                </span>
                <span
                  className={`font-black uppercase text-[var(--gold-500)] tracking-[0.4em] text-[9px] transition-all duration-500 ${
                    isScrolled ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100 max-h-8 mt-1"
                  }`}
                >
                  ȘI ASOCIAȚII
                </span>
              </div>
            )}
          </Link>

          {/* === DESKTOP NAV (Centered below logo) === */}
          <div className="hidden lg:flex items-center justify-center gap-10 xl:gap-16">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-white transition-colors duration-300 group py-1"
              >
                {item.name}
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-[var(--gold-500)] group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </div>

          {/* === MOBILE: Hamburger left, Phone right === */}
          <div className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-white p-2 hover:text-[var(--gold-500)] transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2">
            <Link
              href="/contact"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--gold-500)] hover:bg-[var(--gold-500)]/20 transition-all"
              aria-label="Contact"
            >
              <Phone className="w-4 h-4" />
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
