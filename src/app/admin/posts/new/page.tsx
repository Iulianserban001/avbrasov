"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Save, ArrowLeft, Image as ImageIcon, Globe, 
  Type, FileText, Layout, CheckCircle2, AlertCircle, 
  Loader2, Trash2, Zap, Target, Search, Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadBrandingAsset } from "@/lib/storage"; // Using existing branding storage helper
import type { BlogPost } from "@/types";

export default function PostEditorPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const id = params?.id;
  const isNew = !id;

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    author: "SPS și Asociații",
    content: "",
    excerpt: "",
    status: "DRAFT",
    category: "Juridic",
    metaTitle: "",
    metaDescription: "",
    keywords: ""
  });

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      async function fetchPost() {
        try {
          const docSnap = await getDoc(doc(db as any, "posts", id!));
          if (docSnap.exists()) {
            setPost(docSnap.data() as BlogPost);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchPost();
    }
  }, [id]);

  const handleUpdate = (field: keyof BlogPost, value: any) => {
    setPost(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title if it's a new post and slug isn't manually edited yet
      if (field === 'title' && isNew && !prev.slug?.includes('-')) {
        updated.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      
      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const fileName = `blog/${Date.now()}_${file.name}`;
      const url = await uploadBrandingAsset(file, fileName);
      handleUpdate("featuredImage", url);
      setStatus({ type: "success", msg: "Imagine încărcată cu succes." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Eroare la încărcarea imaginii." });
    } finally {
      setSaving(false);
    }
  };

  const savePost = async () => {
    if (!post.title || !post.slug) {
      setStatus({ type: "error", msg: "Titlul și Slug-ul sunt obligatorii." });
      return;
    }

    try {
      setSaving(true);
      const timestamp = new Date().toISOString();
      const finalPost = {
        ...post,
        updatedAt: timestamp,
        createdAt: post.createdAt || timestamp,
        publishedAt: post.status === 'PUBLISHED' ? (post.publishedAt || timestamp) : null
      };

      if (isNew) {
        await addDoc(collection(db as any, "posts"), finalPost);
      } else {
        await setDoc(doc(db as any, "posts", id), finalPost);
      }

      setStatus({ type: "success", msg: "Articol salvat cu succes!" });
      setTimeout(() => router.push("/admin/posts"), 1500);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Eroare la salvarea articolului." });
    } finally {
      setSaving(false);
    }
  };

  // SEO Analysis Simple Check
  const seoCheck = {
    title: (post.title?.length || 0) > 40,
    metaDesc: (post.metaDescription?.length || 0) > 100,
    keywords: (post.keywords?.includes(',') || false),
    slug: (post.slug?.length || 0) > 5
  };

  if (loading) return (
     <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[var(--gold-500)] animate-spin" />
     </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/admin/posts" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] hover:text-[var(--gold-500)] transition-colors">
            <ArrowLeft className="w-3 h-3" /> Înapoi la Listă
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[var(--stone-100)] tracking-tighter uppercase italic">{isNew ? "Nou Articol" : "Editare Articol"}</h1>
            <p className="text-xs font-bold text-[var(--stone-500)] uppercase tracking-[0.25em]">Configurare Conținut & Parametri SEO.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <select 
             value={post.status}
             onChange={(e) => handleUpdate("status", e.target.value)}
             className="input-pro h-14 w-auto font-black cursor-pointer bg-[var(--stone-900)] border-[var(--premium-border)]"
           >
             <option value="DRAFT">SCHIȚĂ</option>
             <option value="PUBLISHED">PUBLICAT</option>
           </select>
           <button 
             onClick={savePost}
             disabled={saving}
             className="btn-primary flex items-center gap-2 px-8 min-w-[180px] justify-center disabled:opacity-50"
           >
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {saving ? "Se salvează..." : "Salvează Articol"}
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-8">
            <div className="premium-card p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1 flex items-center gap-2">
                    <Type className="w-3 h-3" /> Titlu Articol
                  </label>
                  <input 
                    type="text" 
                    value={post.title} 
                    onChange={(e) => handleUpdate("title", e.target.value)}
                    className="text-2xl font-serif bg-transparent border-b border-white/10 w-full py-4 text-white focus:border-[var(--gold-500)] outline-none transition-colors"
                    placeholder="Titlul provocator pentru Brașov..."
                  />
               </div>

               <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">URL Slug</label>
                    <input 
                      type="text" 
                      value={post.slug} 
                      onChange={(e) => handleUpdate("slug", e.target.value)}
                      className="input-pro font-mono text-[11px]"
                      placeholder="titlu-articol-seo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Autor</label>
                    <input 
                      type="text" 
                      value={post.author} 
                      onChange={(e) => handleUpdate("author", e.target.value)}
                      className="input-pro"
                    />
                  </div>
               </div>

               <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Rezumat Scurt (Excerpt)</label>
                  <textarea 
                    rows={3}
                    value={post.excerpt} 
                    onChange={(e) => handleUpdate("excerpt", e.target.value)}
                    className="input-pro resize-none text-xs leading-loose"
                    placeholder="Un scurt rezumat care apare în listări..."
                  />
               </div>

               <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1 flex items-center justify-between">
                    <span>Conținut Articol (Rich Text/HTML)</span>
                    <span className="text-[9px] font-bold text-[var(--stone-700)] uppercase">Utilizează H2, H3 pentru SEO</span>
                  </label>
                  <textarea 
                    rows={20}
                    value={post.content} 
                    onChange={(e) => handleUpdate("content", e.target.value)}
                    className="input-pro font-serif text-base leading-relaxed p-10 min-h-[600px] bg-black/40"
                    placeholder="Scrie corpul articolului aici..."
                  />
               </div>
            </div>
         </div>

         {/* SEO & Sidebar */}
         <div className="space-y-8">
            <div className="premium-card p-8 space-y-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-[var(--stone-100)] flex items-center gap-2">
                 <Search className="w-4 h-4 text-[var(--gold-500)]" /> Optimizare SEO
               </h3>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Meta Title</label>
                    <input type="text" value={post.metaTitle} onChange={(e) => handleUpdate("metaTitle", e.target.value)} className="input-pro" placeholder="Titlu pentru Google..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Meta Description</label>
                    <textarea rows={3} value={post.metaDescription} onChange={(e) => handleUpdate("metaDescription", e.target.value)} className="input-pro resize-none" placeholder="Descriere pentru Google (max 160 caractere)..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--stone-500)] px-1">Cuvinte Cheie</label>
                    <input type="text" value={post.keywords} onChange={(e) => handleUpdate("keywords", e.target.value)} className="input-pro" placeholder="avocat brasov, litigii, etc." />
                  </div>
               </div>

               {/* SEO Checklist */}
               <div className="pt-6 border-t border-[var(--premium-border)] space-y-3">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--stone-500)]">Checklist R1 Brașov</h4>
                  {[
                    { label: "Slug SEO-Friendly", ok: seoCheck.slug },
                    { label: "Titlu Strategic", ok: seoCheck.title },
                    { label: "Meta Descriere Completă", ok: seoCheck.metaDesc },
                    { label: "Multiple Cuvinte Cheie", ok: seoCheck.keywords }
                  ].map((check, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-bold">
                       <span className={check.ok ? "text-stone-300" : "text-stone-600"}>{check.label}</span>
                       {check.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-stone-800" />}
                    </div>
                  ))}
               </div>
            </div>

            <div className="premium-card p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--stone-100)] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[var(--gold-500)]" /> Imagine Reprezentativă
                  </h3>
                  <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black text-[var(--gold-500)] uppercase hover:underline">Încarcă</button>
               </div>
               <div className="aspect-video rounded-xl bg-black border border-white/5 flex items-center justify-center overflow-hidden group relative">
                  {post.featuredImage ? (
                    <>
                      <img src={post.featuredImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Featured" />
                      <button onClick={() => handleUpdate("featuredImage", "")} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 text-[10px] font-black uppercase">
                        Șterge Imaginea
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-stone-600">
                       <ImageIcon className="w-8 h-8" />
                       <span className="text-[9px] font-bold uppercase">Dimensiuni optime: 1200x630</span>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
               </div>
            </div>

            <div className="premium-card p-8 bg-gradient-to-br from-[#111] to-black border-l-4 border-l-[var(--gold-500)]">
               <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-[var(--gold-500)]" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Sfaturi Elite</h3>
               </div>
               <p className="text-[11px] text-stone-500 leading-relaxed font-serif italic">
                 "Conținutul de lungă durată (1000+ cuvinte) care oferă valoare reală clienților din Brașov este cea mai rapidă cale către R1. Nu scrie doar informație, scrie autoritate."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
