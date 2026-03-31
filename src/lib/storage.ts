"use client";

import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path in storage (e.g., 'logos/main-logo.png').
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

/**
 * Deletes a file from Firebase Storage.
 * @param path The path or full URL of the file to delete.
 */
export async function deleteFile(path: string): Promise<void> {
  // If it's a full URL, we need to extract the path or use refFromURL (not available in lite, but we use standard)
  // For simplicity, we assume path is the internal storage path.
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
