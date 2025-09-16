export interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  group: CategoryGroup;
  products: unknown[];
  parentId?: string | null;
  children?: Category[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  groupId: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description: string;
  groupId: string;
}

export interface CategoryFilters extends Record<string, unknown> {
  search?: string;
  groupId?: string | null;
  page?: string | number;
  limit?: string | number;
}
