export interface Color {
  id: string;
  name: string;
  code: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateColorRequest {
  name: string;
  code: string;
}

export interface UpdateColorRequest {
  name: string;
  code: string;
}

export interface ColorFilters extends Record<string, unknown> {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
