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
  Menu,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Centru Comandă", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Pagini", icon: FileText },
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
    <div className="flex h-screen overflow-hidden bg-[var(--navy-950)]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:relative
          ${collapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--glass-border)]">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] flex items-center justify-center">
                <Scale className="w-4 h-4 text-[var(--navy-950)]" />
              </div>
              <span className="font-bold text-sm gold-gradient">AVOCAT BRAȘOV</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] flex items-center justify-center mx-auto">
              <Scale className="w-4 h-4 text-[var(--navy-950)]" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--glass-hover)] text-[var(--navy-400)] transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-[var(--gold-400)]" : ""}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-[var(--glass-border)]">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-[var(--navy-700)] flex items-center justify-center text-xs font-bold text-[var(--gold-400)]">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--navy-200)] truncate">{user?.email}</p>
                <p className="text-xs text-[var(--navy-500)]">Owner</p>
              </div>
              <button 
                onClick={() => signOut()}
                className="text-[var(--navy-500)] hover:text-[var(--navy-300)] transition-colors"
                title="Deconectare"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-[var(--glass-border)] bg-[var(--navy-950)]/95 backdrop-blur-md">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-[var(--navy-400)] hover:text-[var(--navy-200)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[var(--navy-500)] hover:text-[var(--gold-400)] transition-colors"
            >
              Vezi site-ul →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
