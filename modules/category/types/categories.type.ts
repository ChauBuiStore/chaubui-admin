export interface CategoryGroup {
  id: string;
  nameVi: string;
  nameEn: string;
  nameKm: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  nameVi: string;
  nameEn: string;
  nameKm: string;
  slug: string;
  description: string;
  group: CategoryGroup;
  products: unknown[];
  parentId?: string | null;
  children?: Category[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateCategoryData {
  nameVi: string;
  nameEn: string;
  nameKm: string;
  description: string;
  groupId: string;
}

export interface UpdateCategoryData {
  nameVi: string;
  nameEn: string;
  nameKm: string;
  description: string;
  groupId: string;
}

export interface CategoryFilters extends Record<string, unknown> {
  search?: string;
  groupId?: string | null;
  page?: string | number;
  limit?: string | number;
}
