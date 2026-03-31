import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Scale, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { BlogPost, SiteSettings } from "@/types";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getPosts(): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db as any, "posts"), 
      where("status", "==", "PUBLISHED"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
  } catch (err) {
    console.warn("Blog posts fetch failed (Build Time?):", err);
    return [];
  }
}

async function getSettings(): Promise<SiteSettings | null> {
  try {
    const snap = await getDoc(doc(db as any, "settings", "global"));
    return snap.exists() ? (snap.data() as SiteSettings) : null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const domain = "avocatbrasov.ro"; // To be updated
  
  return {
    title: `Blog Juridic & Noutăți Legislative ${settings?.metaTitleSuffix || "| SPS și Asociații"}`,
    description: "Analize juridice, noutăți legislative și sfaturi de la experții noștri în drept din Brașov. Rămâneți informați cu SPS și Asociații.",
    openGraph: {
      title: "Blog Juridic - SPS și Asociații Brașov",
      description: "Expertiză juridică de elită în format digital.",
      images: [settings?.logoUrl || "/og-image.jpg"],
    }
  };
}

export default async function BlogArchivePage() {
  const posts = await getPosts();

  return (
    <div className="bg-[#050505] min-h-screen text-stone-100 pb-32">
      {/* Hero Section */}
      <section className="relative py-32 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gold-900)_0%,_transparent_70%)] opacity-10" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Perspective <span className="text-[var(--gold-500)]">Juridice</span>.
            </h1>
            <p className="text-xl text-stone-400 font-serif leading-relaxed italic max-w-xl">
              Analize profunde și noutăți legislative esențiale pentru mediul de afaceri și viața privată în Brașov.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-24 container-custom">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group block space-y-6"
              >
                <div className="aspect-[16/10] overflow-hidden bg-stone-900 border border-white/5 relative">
                   {post.featuredImage ? (
                     <img 
                       src={post.featuredImage} 
                       alt={post.title} 
                       className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <Scale className="w-12 h-12 text-stone-800" />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold-500)]">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('ro-RO')}</span>
                    <span className="w-1 h-1 rounded-full bg-stone-700" />
                    <span>{post.category || "General"}</span>
                  </div>
                  <h2 className="text-2xl font-serif leading-tight group-hover:text-[var(--gold-400)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                    Citește Articolul <ArrowRight className="w-4 h-4 text-[var(--gold-500)]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <Scale className="w-16 h-16 text-stone-800 mx-auto" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">Niciun articol publicat momentan</h3>
            <p className="text-stone-500 font-serif italic">Reveniți curând pentru noi analize juridice.</p>
          </div>
        )}
      </section>
    </div>
  );
}
