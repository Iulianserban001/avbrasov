import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
