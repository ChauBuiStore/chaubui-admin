import type { FileUpload } from "@/lib/types";

export interface FormImage {
  fileId: string;
  alt: string;
  sortOrder: number;
}

export function normalizeImages(images: FormImage[]): FormImage[] {
  const filtered = (images || []).filter((img) => Boolean(img && img.fileId));
  return filtered.map((img, index) => ({
    ...img,
    alt: img.alt || `Image ${index + 1}`,
    sortOrder: index + 1,
  }));
}

export function mergeNewUploads(currentImages: FormImage[], uploads: FileUpload[]): FormImage[] {
  const base = Array.isArray(currentImages) ? currentImages : [];
  const newOnes: FormImage[] = (uploads || []).map((u, idx) => ({
    fileId: u.id,
    alt: u.fileName || `Image ${base.length + idx + 1}`,
    sortOrder: base.length + idx + 1,
  }));
  return normalizeImages([...base, ...newOnes]);
}

export function removeImageById(currentImages: FormImage[], fileId: string): FormImage[] {
  const remaining = (currentImages || []).filter((img) => img.fileId !== fileId);
  return normalizeImages(remaining);
}
