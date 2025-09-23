import { FileUpload } from "@/lib/types";

export interface ProductImage {
  id: string;
  file: FileUpload;
  alt: string;
  sortOrder: number;
  isThumbnail: boolean;
}