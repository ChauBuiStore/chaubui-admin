export interface Menu {
  id: string;
  nameVi: string;
  nameEn: string;
  nameKm?: string;
  slug: string;
  isPublic?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateMenuData {
  nameVi: string;
  nameEn: string;
  nameKm?: string;
}

export interface UpdateMenuData {
  nameVi: string;
  nameEn: string;
  nameKm?: string;
}

export interface MenuFilters extends Record<string, unknown> {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
