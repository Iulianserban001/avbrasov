import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { getDoc, doc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteSettings, OfficeLocation } from "@/types";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

async function getSettings(): Promise<SiteSettings | null> {
  try {
    const snap = await getDoc(doc(db as any, "settings", "global"));
    return snap.exists() ? (snap.data() as SiteSettings) : null;
  } catch (err) {
    return null;
  }
}

async function getLocations(): Promise<OfficeLocation[]> {
  try {
    const q = query(collection(db as any, "locations"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as OfficeLocation));
  } catch (err) {
    return [];
  }
}

export const metadata: Metadata = {
  title: {
    default: "SPS și Asociații — Excelență în Avocatură Brașov",
    template: "%s | SPS și Asociații",
  },
  description: "SPS și Asociații — Cabinet de avocatură de prestigiu în Brașov. Consultanță juridică strategică și apărare de neclintit în drept civil, penal și corporate.",
  metadataBase: new URL("https://avocatbrasov.ro"),
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "SPS și Asociații",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const locations = await getLocations();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": settings?.firmName || "SPS și Asociații",
    "description": settings?.firmDescription || "Cabinet de avocatură de elită în Brașov.",
    "url": "https://avocat-brasov.ro",
    "telephone": settings?.firmPhone,
    "email": settings?.firmEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.firmAddress,
      "addressLocality": settings?.firmCity || "Brașov",
      "addressRegion": settings?.firmCounty || "Brașov",
      "postalCode": settings?.firmZipCode,
      "addressCountry": "RO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": settings?.firmLatitude || 45.6427,
      "longitude": settings?.firmLongitude || 25.5887
    }
  };

  return (
    <html lang="ro">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-black text-stone-200 overflow-x-hidden w-full flex flex-col items-center`}>
        <Header settings={settings} />
        <main className="w-full flex flex-col items-center min-h-screen">
          {children}
        </main>
        <Footer settings={settings} locations={locations} />
      </body>
    </html>
  );
}
