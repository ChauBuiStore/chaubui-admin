export interface Color {
  id: string;
  nameVi: string;
  nameEn: string;
  nameKm?: string;
  code: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateColorRequest {
  nameVi: string;
  nameEn: string;
  nameKm?: string;
  code: string;
}

export interface UpdateColorRequest {
  nameVi: string;
  nameEn: string;
  nameKm?: string;
  code: string;
}

export interface ColorFilters extends Record<string, unknown> {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
