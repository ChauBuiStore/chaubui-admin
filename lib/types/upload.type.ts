export interface UploadResponse {
  id: string;
  fileName: string;
  url: string;
  alt: string;
  sortOrder: number;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
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
  file?: File;
}