// ============================================================
// Firestore CRUD Operations for Avocat Brasov
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Page,
  LegalService,
  Locality,
  UserProfile,
  InternalLink,
  SiteSettings,
  AuditLogEntry,
  OfficeLocation,
} from "@/types";

// === COLLECTIONS ===
const PAGES = "pages";
const SERVICES = "services";
const LOCALITIES = "localities";
const USERS = "users";
const LINKS = "internal_links";
const SETTINGS = "site_settings";
const AUDIT = "audit_log";
const OFFICE_LOCATIONS = "office_locations";

// === HELPERS ===
function cleanUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}

// === PAGES ===
export async function getPages(filters?: { status?: string; pageType?: string }): Promise<Page[]> {
  const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc")];
  if (filters?.status) constraints.push(where("status", "==", filters.status));
  if (filters?.pageType) constraints.push(where("pageType", "==", filters.pageType));
  const q = query(collection(db, PAGES), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Page));
}

export async function getPage(id: string): Promise<Page | null> {
  const snap = await getDoc(doc(db, PAGES, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Page;
}

export async function createPage(data: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, PAGES), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePage(id: string, data: Partial<Page>): Promise<void> {
  await updateDoc(doc(db, PAGES, id), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deletePage(id: string): Promise<void> {
  await deleteDoc(doc(db, PAGES, id));
}

// === SERVICES ===
export async function getServices(): Promise<LegalService[]> {
  const q = query(collection(db, SERVICES), orderBy("sortOrder", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LegalService));
}

export async function getService(id: string): Promise<LegalService | null> {
  const snap = await getDoc(doc(db, SERVICES, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as LegalService;
}

export async function createService(data: Omit<LegalService, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, SERVICES), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateService(id: string, data: Partial<LegalService>): Promise<void> {
  await updateDoc(doc(db, SERVICES, id), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, SERVICES, id));
}

// === LOCALITIES ===
export async function getLocalities(): Promise<Locality[]> {
  const q = query(collection(db, LOCALITIES), orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Locality));
}

export async function getLocality(id: string): Promise<Locality | null> {
  const snap = await getDoc(doc(db, LOCALITIES, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Locality;
}

export async function createLocality(data: Omit<Locality, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, LOCALITIES), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateLocality(id: string, data: Partial<Locality>): Promise<void> {
  await updateDoc(doc(db, LOCALITIES, id), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLocality(id: string): Promise<void> {
  await deleteDoc(doc(db, LOCALITIES, id));
}

// === USERS ===
export async function getUsers(): Promise<UserProfile[]> {
  const q = query(collection(db, USERS), orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile));
}

export async function getUser(id: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserProfile;
}

export async function createUserProfile(data: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<string> {
  const payload = {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (data.id) {
    // If ID is provided (e.g., Auth UID), use setDoc
    const { setDoc } = await import("firebase/firestore");
    await setDoc(doc(db, USERS, data.id), payload);
    return data.id;
  } else {
    // Otherwise add new generated document
    const docRef = await addDoc(collection(db, USERS), payload);
    return docRef.id;
  }
}

export async function updateUserProfile(id: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, USERS, id), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserProfile(id: string): Promise<void> {
  await deleteDoc(doc(db, USERS, id));
}

// === INTERNAL LINKS ===
export async function getInternalLinks(): Promise<InternalLink[]> {
  const q = query(collection(db, LINKS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as InternalLink));
}

export async function createInternalLink(data: Omit<InternalLink, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, LINKS), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateInternalLink(id: string, data: Partial<InternalLink>): Promise<void> {
  await updateDoc(doc(db, LINKS, id), cleanUndefined(data as unknown as Record<string, unknown>));
}

export async function deleteInternalLink(id: string): Promise<void> {
  await deleteDoc(doc(db, LINKS, id));
}

// === SETTINGS ===
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, SETTINGS, "main"));
  if (!snap.exists()) return null;
  return snap.data() as SiteSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, SETTINGS, "main");
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    const { setDoc } = await import("firebase/firestore");
    await setDoc(docRef, { ...cleanUndefined(data as unknown as Record<string, unknown>), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  } else {
    await updateDoc(docRef, { ...cleanUndefined(data as unknown as Record<string, unknown>), updatedAt: serverTimestamp() });
  }
}

// === OFFICE LOCATIONS ===
export async function getOfficeLocations(): Promise<OfficeLocation[]> {
  const q = query(collection(db, OFFICE_LOCATIONS), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as OfficeLocation));
}

export async function createOfficeLocation(data: Omit<OfficeLocation, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, OFFICE_LOCATIONS), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOfficeLocation(id: string, data: Partial<OfficeLocation>): Promise<void> {
  await updateDoc(doc(db, OFFICE_LOCATIONS, id), {
    ...cleanUndefined(data as unknown as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOfficeLocation(id: string): Promise<void> {
  await deleteDoc(doc(db, OFFICE_LOCATIONS, id));
}

// === AUDIT LOG ===
export async function addAuditLog(entry: Omit<AuditLogEntry, "id" | "createdAt">): Promise<void> {
  await addDoc(collection(db, AUDIT), {
    ...cleanUndefined(entry as unknown as Record<string, unknown>),
    createdAt: serverTimestamp(),
  });
}

export async function getAuditLogs(entityId?: string, limitCount = 50): Promise<AuditLogEntry[]> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc"), limit(limitCount)];
  if (entityId) constraints.push(where("entityId", "==", entityId));
  const q = query(collection(db, AUDIT), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditLogEntry));
}
