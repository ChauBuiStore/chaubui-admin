export interface Size {
  id: string;
  name: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateSizeData {
  name: string;
}

export interface UpdateSizeData {
  name?: string;
}

export interface SizeFilters extends Record<string, unknown> {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
