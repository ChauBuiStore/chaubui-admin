export interface ApiResponse<T = unknown> {
  message: string;
  status: 'success' | 'error';
  statusCode: number;
  data?: T;
}

export interface ApiErrorResponse {
  message: string;
  status: 'error';
  statusCode: number;
  errors?: Record<string, string[]>;
}
