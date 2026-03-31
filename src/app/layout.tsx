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
    default: "Avocat Brașov — Cabinet de Avocatură | Consultanță Juridică",
    template: "%s | Avocat Brașov",
  },
  description: "Cabinet de avocatură în Brașov. Avocat specializat în divorțuri, succesiuni, drept penal, executare silită. Consultanță juridică profesională.",
  metadataBase: new URL("https://avocatbrasov.ro"),
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "Cabinet Avocat Brașov",
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
