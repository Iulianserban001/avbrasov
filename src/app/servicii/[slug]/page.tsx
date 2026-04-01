import React from "react";
import { getPageBySlug, getSiteSettings } from "@/lib/firestore";
import { notFound } from "next/navigation";
import ServiceDetailClient from "@/app/components/servicii/ServiceDetailClient";
import { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  const settings = await getSiteSettings();
  
  if (!page) return { title: "Serviciu Inexistent" };

  return {
    title: `${page.title} | ${settings?.firmName || "SPS și Asociații"}`,
    description: page.metaDescription || page.excerpt,
    openGraph: {
      title: page.title,
      description: page.metaDescription || page.excerpt,
      images: page.featuredImage ? [page.featuredImage] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const page = await getPageBySlug(params.slug);
  const settings = await getSiteSettings();

  if (!page || page.pageType !== "SERVICE_DETAIL") {
    notFound();
  }

  return <ServiceDetailClient page={page} settings={settings} />;
}
