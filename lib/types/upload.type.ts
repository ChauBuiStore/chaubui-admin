import { FileUpload } from "./file.type";

export interface Upload {
  data: FileUpload[];
  count: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  maxSize?: number;
  allowedTypes?: string[];
  folder?: string;
}

export interface UploadError extends Error {
  code?: string;
  file?: FileUpload;
}