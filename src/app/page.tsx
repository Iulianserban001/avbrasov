import { collection, query, getDocs, doc, getDoc, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HomeClient from "./components/home/HomeClient";
import type { SiteSettings, LegalService, OfficeLocation, BlogPost, UserProfile } from "@/types";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getSettings(): Promise<SiteSettings | null> {
  try {
    const snap = await getDoc(doc(db as any, "settings", "global"));
    return snap.exists() ? (snap.data() as SiteSettings) : null;
  } catch (err) {
    console.warn("Settings fetch failed (Build Time?):", err);
    return null;
  }
}

async function getServices(): Promise<LegalService[]> {
  try {
    const snap = await getDocs(query(collection(db as any, "services"), limit(6)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as LegalService));
  } catch (err) {
    return [];
  }
}

async function getLocations(): Promise<OfficeLocation[]> {
  try {
    const snap = await getDocs(collection(db as any, "office_locations"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as OfficeLocation));
  } catch (err) {
    return [];
  }
}

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const q = query(collection(db as any, "posts"), where("status", "==", "PUBLISHED"), orderBy("createdAt", "desc"), limit(3));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
  } catch (err) {
    return [];
  }
}

async function getAttorneys(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(query(collection(db as any, "users"), where("isActive", "==", true)));
    // Sort logic or role filtering if needed - for now just return active users with a valid role for display
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
    return users.filter(u => ['OWNER', 'LEGAL_REVIEWER', 'ADMIN'].includes(u.role));
  } catch (err) {
    console.warn("Attorneys fetch failed:", err);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  return {
    title: `${settings?.homeH1 || "Avocat Brașov | Consultanță Juridică de Elită"} ${settings?.metaTitleSuffix || "| SPS și Asociații"}`,
    description: settings?.homeMetaDescription || settings?.firmDescription || "SPS și Asociații — Cabinet de avocatură de elită în Brașov specializat în drept civil, penal și consultanță de afaceri.",
    keywords: settings?.homeKeywords || "avocat brasov, sps si asociatii, cabinet avocatura brasov, consultanta juridica",
    openGraph: {
      title: "SPS și Asociații - Avocat Brașov",
      description: "Excelență în avocatură.",
      images: [settings?.logoUrl || "/og-image.jpg"],
    }
  };
}

export default async function HomePage() {
  // Parallel fetch for maximum performance
  const [settings, services, locations, latestPosts, attorneys] = await Promise.all([
    getSettings(),
    getServices(),
    getLocations(),
    getLatestPosts(),
    getAttorneys()
  ]);

  return (
    <HomeClient 
      settings={settings}
      services={services}
      locations={locations}
      latestPosts={latestPosts}
      attorneys={attorneys}
    />
  );
}
