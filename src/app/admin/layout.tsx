"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  FileText,
  Scale,
  MapPin,
  Users,
  Search,
  Link2,
  BarChart3,
  Bug,
  GitBranch,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Centru Comandă", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Pagini", icon: FileText },
  { href: "/admin/posts", label: "Blog & Articole", icon: FileText },
  { href: "/admin/services", label: "Servicii", icon: Scale },
  { href: "/admin/localities", label: "Localități", icon: MapPin },
  { href: "/admin/attorneys", label: "Avocați", icon: Users },
  { href: "/admin/analyzer", label: "Analizor SEO", icon: Search },
  { href: "/admin/links", label: "Linking Intern", icon: Link2 },
  { href: "/admin/performance", label: "Performanță", icon: BarChart3 },
  { href: "/admin/crawl", label: "SEO Tehnic", icon: Bug },
  { href: "/admin/workflow", label: "Publicare", icon: GitBranch },
  { href: "/admin/settings", label: "Setări", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--navy-950)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--navy-800)] border-t-[var(--gold-500)] rounded-full animate-spin" />
      </div>
    );
  }

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <main className="min-h-screen bg-[var(--navy-950)] relative overflow-hidden">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--stone-950)]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:relative border-r border-[var(--premium-border)]
          ${collapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between px-6">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[var(--stone-900)] border border-[var(--premium-border)] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[var(--gold-500)]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-[0.1em] text-[var(--stone-100)] uppercase leading-none">SPS</span>
                <span className="text-[9px] font-semibold text-[var(--gold-500)] tracking-widest uppercase">ȘI ASOCIAȚII</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-lg bg-[var(--stone-900)] border border-[var(--premium-border)] flex items-center justify-center mx-auto">
              <Scale className="w-5 h-5 text-[var(--gold-500)]" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--premium-hover)] text-[var(--stone-500)] transition-colors border border-transparent hover:border-[var(--premium-border)]"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`sidebar-link ${active ? "active" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-[var(--gold-500)]" : ""}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-[var(--premium-border)]">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--stone-900)] border border-[var(--premium-border)]">
              <div className="w-8 h-8 rounded-full bg-[var(--stone-100)] text-[var(--stone-950)] flex items-center justify-center text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-[var(--stone-100)] truncate uppercase tracking-tighter">{user?.email}</p>
                <p className="text-[10px] text-[var(--gold-500)] font-bold uppercase tracking-widest">Admin</p>
              </div>
              <button 
                onClick={() => signOut()}
                className="text-[var(--stone-500)] hover:text-[var(--red-500)] transition-colors"
                title="Deconectare"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 flex items-center justify-between px-8 bg-[var(--stone-950)] border-b border-[var(--premium-border)]">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-[var(--stone-400)] hover:text-[var(--stone-100)] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 px-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--stone-600)] uppercase tracking-widest">
                <span>Administrare</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[var(--stone-100)]">
                  {navItems.find(i => isActive(i.href, i.exact))?.label || "Tablou de Bord"}
                </span>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="text-[10px] font-bold text-[var(--gold-500)] uppercase tracking-widest hover:text-[var(--stone-100)] transition-colors border border-[var(--gold-500)]/30 px-3 py-1.5 rounded-md hover:border-[var(--gold-500)]"
            >
              Vezi Site Public →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-[1240px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
