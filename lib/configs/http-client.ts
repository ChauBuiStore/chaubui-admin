import { env, isClient } from "./env";
import { ApiResponse, ApiErrorResponse } from "@/lib/types/response.type";

interface HttpClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  onTokenExpired?: () => void;
  timeout?: number;
}

interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
}

class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    let url = `${this.config.baseURL}${endpoint}`;

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
  }

  private getToken(): string | null {
    return typeof isClient ? localStorage.getItem("auth_token") : null;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getToken();

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getFormDataHeaders(): Record<string, string> {
    const token = this.getToken();

    return {
      Accept: "application/json",
      ...this.config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async parseErrorResponse(response: Response): Promise<never> {
    let errorData: ApiErrorResponse;
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text) as ApiErrorResponse;
      } else {
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: 'error' as const,
          statusCode: response.status
        };
      }
    } catch {
      errorData = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: 'error' as const,
        statusCode: response.status
      };
    }

    if (response.status === 401) {
      if (isClient) {
        localStorage.removeItem("auth_token");
      }

      if (this.config.onTokenExpired) {
        this.config.onTokenExpired();
      }

      throw new Error("Unauthorized");
    }

    throw new Error(errorData.message || "Request failed");
  }

  private async parseSuccessResponse<T>(
    response: Response
  ): Promise<ApiResponse<T>> {
    if (response.status === 204 || response.status === 205) {
      return {
        message: "Success",
        status: "success",
        statusCode: response.status,
        data: null as T
      };
    }

    const text = await response.text();
    if (!text) {
      return {
        message: "Success",
        status: "success",
        statusCode: response.status,
        data: null as T
      };
    }

    try {
      const parsedData = JSON.parse(text);

      return parsedData as ApiResponse<T>;
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = { ...this.getAuthHeaders(), ...options.headers };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { params: _params, ...fetchOptions } = options;

    const timeout = this.config.timeout || 10000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.parseErrorResponse(response);
      }

      return this.parseSuccessResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const headers = { ...this.getFormDataHeaders(), ...options?.headers };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { params: _params, ...fetchOptions } = options || {};

    const timeout = this.config.timeout || 10000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "POST",
        body: formData,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.parseErrorResponse(response);
      }

      return this.parseSuccessResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const httpClient = new HttpClient({
  baseURL: env.API_BASE_URL,
});
