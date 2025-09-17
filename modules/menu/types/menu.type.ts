export interface Menu {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateMenuData {
  name: string;
}

export interface UpdateMenuData {
  name?: string;
  isPublic?: boolean;
}

export interface MenuFilters extends Record<string, unknown> {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
