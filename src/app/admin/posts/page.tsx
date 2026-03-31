"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, FileText, Calendar, User, Eye, Trash2, Edit3, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { collection, query, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BlogPost } from "@/types";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db as any, "posts"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)));
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur dorești să ștergi acest articol? Această acțiune este ireversibilă.")) return;
    try {
      await deleteDoc(doc(db as any, "posts", id));
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Eroare la ștergerea articolului.");
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[var(--gold-500)] animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--gold-500)]">Se încarcă articolele</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[var(--stone-100)] tracking-tighter uppercase italic">Management Blog</h1>
          <p className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.25em]">Publică articole SEO-Maximizate pentru Brașov.</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary flex items-center gap-2 px-8 min-w-[200px] justify-center">
          <Plus className="w-4 h-4" /> Nou Articol
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--stone-500)] group-focus-within:text-[var(--gold-500)] transition-colors" />
          <input 
            type="text" 
            placeholder="Caută după titlu sau autor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-pro pl-12 h-14"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="input-pro h-14 w-auto min-w-[160px] cursor-pointer"
          >
            <option value="ALL">Toate Statusurile</option>
            <option value="PUBLISHED">Publicate</option>
            <option value="DRAFT">Schițe</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="premium-card group relative overflow-hidden flex flex-col h-full bg-[#0a0a0a]">
              {/* Image Preview */}
              <div className="aspect-video relative overflow-hidden bg-[var(--stone-900)] border-b border-[var(--premium-border)]">
                {post.featuredImage ? (
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-12 h-12 text-[var(--stone-800)]" />
                  </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${
                  post.status === 'PUBLISHED' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}>
                  {post.status === 'PUBLISHED' ? "Publicat" : "Schiță"}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--stone-600)] uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('ro-RO')}</span>
                </div>
                <h3 className="text-xl font-serif text-[var(--stone-100)] group-hover:text-[var(--gold-400)] transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-xs text-[var(--stone-500)] line-clamp-3 leading-relaxed font-light">
                  {post.excerpt || "Fără descriere disponibilă."}
                </p>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-[var(--premium-border)] bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/admin/posts/${post.id}`} className="p-2 rounded hover:bg-white/5 text-[var(--gold-500)] transition-colors" title="Editează">
                    <Edit3 className="w-5 h-5" />
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="p-2 rounded hover:bg-white/5 text-red-500 transition-colors" title="Șterge">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <Link href={`/blog/${post.slug}`} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] hover:text-white transition-colors flex items-center gap-1.5">
                  Vezi Live <Eye className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-[var(--stone-900)] flex items-center justify-center border border-[var(--premium-border)]">
              <AlertCircle className="w-10 h-10 text-[var(--stone-700)]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white uppercase tracking-widest italic">Niciun articol găsit</h3>
              <p className="text-xs text-[var(--stone-500)] max-w-sm uppercase tracking-widest">Incepe să scrii astăzi pentru a domina piața juridică din Brașov.</p>
            </div>
            <Link href="/admin/posts/new" className="text-[10px] font-black uppercase tracking-widest text-[var(--gold-500)] hover:underline">
              Creează primul tău articol acum
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
