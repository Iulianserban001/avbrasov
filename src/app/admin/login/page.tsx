"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Scale, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The auth-context will automatically redirect on successful auth
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Email sau parolă incorectă.");
      } else {
        setError("A apărut o eroare. Încercați din nou.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold-500)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] flex items-center justify-center shadow-lg shadow-[var(--gold-500)]/20 mb-4">
            <Scale className="w-8 h-8 text-[var(--navy-950)]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Platforma Avocat</h1>
          <p className="text-sm text-[var(--navy-400)] text-center">
            Autentificare securizată
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--navy-500)] pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white placeholder:text-[var(--navy-600)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                placeholder="admin@avocatbrasov.ro"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--navy-200)] mb-1.5">
              Parolă
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--navy-500)] pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--navy-900)] border border-[var(--glass-border)] text-white placeholder:text-[var(--navy-600)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] hover:from-[var(--gold-400)] hover:to-[var(--gold-500)] text-[var(--navy-950)] font-bold text-sm shadow-lg shadow-[var(--gold-500)]/20 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)] focus:ring-offset-2 focus:ring-offset-[var(--navy-950)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[var(--navy-950)]/30 border-t-[var(--navy-950)] rounded-full animate-spin" />
            ) : (
              "Conectare"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
