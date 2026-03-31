import { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://avocatbrasov.ro";

  try {
    // Parallel fetches with error handling
    const [servSnap, postSnap] = await Promise.all([
      getDocs(collection(db as any, "services")).catch(() => ({ docs: [] })),
      getDocs(collection(db as any, "posts")).catch(() => ({ docs: [] }))
    ]);

  const services = servSnap.docs.map((doc) => ({
    url: `${baseUrl}/servicii/${doc.data().slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const posts = postSnap.docs
    .filter(doc => doc.data().status === "PUBLISHED")
    .map((doc) => ({
      url: `${baseUrl}/blog/${doc.data().slug}`,
      lastModified: new Date(doc.data().updatedAt || doc.data().createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...services,
      ...posts,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  }
}
