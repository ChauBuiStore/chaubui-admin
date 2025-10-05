import { Category } from "@/modules/category/types/categories.type";

export interface CategoryGroup {
  id: string;
  nameVi: string;
  nameEn: string;
  nameKm: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
}

export interface CreateCategoryGroupData {
  nameVi: string;
  nameEn: string;
  nameKm: string;
}

export interface UpdateCategoryGroupData {
  nameVi: string;
  nameEn: string;
  nameKm: string;
}

export interface CategoryGroupFilters extends Record<string, unknown> {
  page?: number;
  limit?: number;
  search?: string;
}
