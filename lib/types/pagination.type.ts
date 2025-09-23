export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number | string;
  totalPages: number;
}

export interface PaginatedResponse<T = unknown> {
  data: T;
  meta: PaginationMeta;
}
