import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a branding asset (logo/hero) to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in storage (e.g., 'branding/logo.png').
 * @returns The download URL of the uploaded file.
 */
export async function uploadBrandingAsset(file: File, path: string): Promise<string> {
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
