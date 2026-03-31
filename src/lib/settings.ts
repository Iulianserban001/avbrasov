import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { SiteSettings } from "@/types";

/**
 * Fetches the global site settings from Firestore.
 * Used for dynamic branding (logo, hero) on the public site.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
    return null;
  } catch (err) {
    console.error("Error fetching site settings:", err);
    return null;
  }
}
