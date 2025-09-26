export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number | string;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  message: string;
  status: 'success' | 'error';
  statusCode: number;
  data?: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  message: string;
  status: 'error';
  statusCode: number;
  errors?: Record<string, string[]>;
}

