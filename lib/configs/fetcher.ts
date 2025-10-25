import { ApiErrorResponse, ApiResponse } from "@/lib/types/response.type";
import { authCookies } from "@/lib/utils/cookies.utils";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4200/api";
const DEFAULT_TIMEOUT = 10000;

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}

let onTokenExpiredCallback: (() => void) | undefined;

export const setOnTokenExpired = (callback: () => void): void => {
  onTokenExpiredCallback = callback;
};

export const clearOnTokenExpired = (): void => {
  onTokenExpiredCallback = undefined;
};

const buildUrl = (endpoint: string, params?: Record<string, unknown>): string => {
  let url = `${API_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};

const getHeaders = (
  token?: string | null,
  isFormData = false,
  customHeaders?: Record<string, string>,
): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...customHeaders,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleErrorResponse = async (response: Response): Promise<never> => {
  let errorData: ApiErrorResponse;

  try {
    const text = await response.text();
    if (text) {
      errorData = JSON.parse(text) as ApiErrorResponse;
    } else {
      errorData = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: "error" as const,
        statusCode: response.status,
      };
    }
  } catch {
    errorData = {
      message: `HTTP ${response.status}: ${response.statusText}`,
      status: "error" as const,
      statusCode: response.status,
    };
  }

  if (response.status === 401) {
    authCookies.remove();

    if (onTokenExpiredCallback) {
      onTokenExpiredCallback();
    }

    throw new Error(errorData.message || "Unauthorized");
  }

  throw new Error(errorData.message || "Request failed");
};

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (response.status === 204 || response.status === 205) {
    return {
      message: "Success",
      status: "success",
      statusCode: response.status,
      data: null as T,
    };
  }

  const text = await response.text();
  if (!text) {
    return {
      message: "Success",
      status: "success",
      statusCode: response.status,
      data: null as T,
    };
  }

  try {
    const parsedData = JSON.parse(text);
    return parsedData as ApiResponse<T>;
  } catch {
    throw new Error("Invalid JSON response from server");
  }
};

const executeRequest = async <T = unknown>(
  url: string,
  fetchOptions: RequestInit,
  timeout: number,
): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return parseResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }

    throw error;
  }
};

const request = async <T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
  config: RequestConfig = {},
  useAuth = false,
): Promise<ApiResponse<T>> => {
  const url = buildUrl(endpoint, config.params);
  const timeout = config.timeout || DEFAULT_TIMEOUT;
  const token = useAuth ? authCookies.get() : null;

  return executeRequest<T>(
    url,
    {
      method,
      headers: getHeaders(token, false, config.headers),
      body: body ? JSON.stringify(body) : undefined,
    },
    timeout,
  );
};

const requestFormData = async <T = unknown>(
  endpoint: string,
  formData: FormData,
  config: RequestConfig = {},
  useAuth = false,
): Promise<ApiResponse<T>> => {
  const url = buildUrl(endpoint, config.params);
  const timeout = config.timeout || DEFAULT_TIMEOUT;
  const token = useAuth ? authCookies.get() : null;

  return executeRequest<T>(
    url,
    {
      method: "POST",
      headers: getHeaders(token, true, config.headers),
      body: formData,
    },
    timeout,
  );
};

export const fetcher = {
  get: <T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> =>
    request<T>(endpoint, "GET", undefined, config, false),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => request<T>(endpoint, "POST", body, config, false),

  put: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => request<T>(endpoint, "PUT", body, config, false),

  patch: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => request<T>(endpoint, "PATCH", body, config, false),

  delete: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => request<T>(endpoint, "DELETE", body, config, false),

  postFormData: <T = unknown>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => requestFormData<T>(endpoint, formData, config, false),
};

export const authFetcher = {
  get: <T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> =>
    request<T>(endpoint, "GET", undefined, config, true),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => request<T>(endpoint, "POST", body, config, true),

  put: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => request<T>(endpoint, "PUT", body, config, true),

  patch: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => request<T>(endpoint, "PATCH", body, config, true),

  delete: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => request<T>(endpoint, "DELETE", body, config, true),

  postFormData: <T = unknown>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => requestFormData<T>(endpoint, formData, config, true),
};
