import { Category } from "@/modules/category/types/categories.type";

export interface CategoryGroup {
  id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
}

export interface CreateCategoryGroupData {
  name: string;
}

export interface UpdateCategoryGroupData {
  name: string;
}

export interface CategoryGroupFilters extends Record<string, unknown> {
  page?: number;
  limit?: number;
  search?: string;
}
