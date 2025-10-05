export interface Size {
  id: string;
  nameVi: string;
  nameEn: string;
  nameKm?: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateSizeData {
  nameVi: string;
  nameEn: string;
  nameKm?: string;
}

export interface UpdateSizeData {
  nameVi?: string;
  nameEn?: string;
  nameKm?: string;
}

export interface SizeFilters extends Record<string, unknown> {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
