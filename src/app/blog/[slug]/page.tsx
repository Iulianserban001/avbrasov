import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Scale, Calendar, User, ArrowLeft, Share2, Facebook, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BlogPost, SiteSettings } from "@/types";

export const dynamic = "force-dynamic";

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const q = query(
      collection(db as any, "posts"), 
      where("slug", "==", slug),
      where("status", "==", "PUBLISHED"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;
  } catch (err) {
    console.warn("Post fetch failed (Build Time?):", err);
    return null;
  }
}

async function getSettings(): Promise<SiteSettings | null> {
  try {
    const snap = await getDocs(collection(db as any, "settings"));
    const global = snap.docs.find(d => d.id === "global");
    return global ? (global.data() as SiteSettings) : null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  const settings = await getSettings();

  if (!post) return { title: "Articol Negăsit" };

  return {
    title: `${post.metaTitle || post.title} ${settings?.metaTitleSuffix || "| SPS și Asociații"}`,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || settings?.logoUrl || "/og-image.jpg"],
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || "/og-image.jpg"],
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const settings = await getSettings();

  if (!post) notFound();

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.featuredImage || settings?.logoUrl,
    "author": {
      "@type": "Organization",
      "name": "SPS și Asociații",
      "url": "https://avocatbrasov.ro" // Updated domain when available
    },
    "publisher": {
      "@type": "Organization",
      "name": "SPS și Asociații",
      "logo": {
        "@type": "ImageObject",
        "url": settings?.logoUrl
      }
    },
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt,
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://avocatbrasov.ro/blog/${post.slug}`
    }
  };

  return (
    <article className="bg-[#050505] min-h-screen text-stone-100 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <header className="relative pt-40 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gold-900)_0%,_transparent_70%)] opacity-10" />
        <div className="container-custom relative z-10 space-y-10">
          <Link href="/blog" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold-500)] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Înapoi la Blog
          </Link>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[1.1] text-white">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
               <span className="flex items-center gap-2 text-[var(--gold-500)]"><User className="w-4 h-4" /> {post.author}</span>
               <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('ro-RO')}</span>
               <span className="flex items-center gap-2 text-emerald-500/80"><Scale className="w-4 h-4" /> {post.category || "General"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Layout */}
      <div className="container-custom py-20">
        <div className="flex flex-col lg:flex-row gap-20">
           {/* Main Content */}
           <div className="flex-1 max-w-4xl">
              {post.featuredImage && (
                <div className="aspect-video mb-16 overflow-hidden rounded-sm border border-white/5">
                   <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* The Body - Serif for Premium Reading Experience */}
              <div 
                 className="prose prose-invert prose-stone max-w-none 
                            prose-headings:font-serif prose-headings:tracking-tight prose-headings:uppercase prose-headings:italic
                            prose-p:text-lg prose-p:leading-relaxed prose-p:font-serif prose-p:text-stone-300
                            prose-strong:text-white prose-a:text-[var(--gold-500)]"
                 dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share */}
              <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between">
                 <div className="text-[10px] font-black uppercase tracking-widest text-stone-500">Distribuie Articolul</div>
                 <div className="flex items-center gap-6">
                    <button className="text-stone-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></button>
                    <button className="text-stone-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></button>
                    <button className="text-stone-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></button>
                 </div>
              </div>
           </div>

           {/* Sidebar CTA */}
           <aside className="lg:w-[400px] space-y-12 shrink-0">
              <div className="premium-card p-10 bg-gradient-to-br from-[#111] to-black sticky top-32">
                 <div className="w-16 h-1 bg-[var(--gold-500)] mb-8" />
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-6 leading-none">
                    Justiție de <br /> <span className="text-[var(--gold-500)]">Prestigiu</span> la Brașov.
                 </h3>
                 <p className="text-sm text-stone-400 font-serif leading-relaxed italic mb-10">
                    SPS și Asociații oferă consultanță strategică și apărare de neclintit. Contactați-ne pentru un audit juridic pe măsura obiectivelor dumneavoastră.
                 </p>
                 <Link href="/#contact" className="btn-primary w-full text-center py-5 text-[10px] tracking-[0.3em] font-black uppercase">
                    Programează Consultanță
                 </Link>
              </div>

              <div className="p-10 border border-white/5 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">Expertiza Noastră</h4>
                 <div className="space-y-4">
                    {["Drept Civil", "Drept Penal", "Consultantă Business", "Litigii"].map(tag => (
                      <div key={tag} className="flex items-center gap-3 text-sm font-serif italic text-stone-300">
                         <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-600)]" />
                         {tag}
                      </div>
                    ))}
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </article>
  );
}
