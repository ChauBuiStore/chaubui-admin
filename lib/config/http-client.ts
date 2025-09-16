import { env } from "./env";

interface HttpClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
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

  private async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<{ data: T }> {
    let url = `${this.config.baseURL}${endpoint}`;

    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const { params: _params, ...fetchOptions } = options;

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    const data = await response.json();
    return { data };
  }

  async get<T>(
    endpoint: string,
    options?: RequestConfig
  ): Promise<{ data: T }> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestConfig
  ): Promise<{ data: T }> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const httpClient = new HttpClient({
  baseURL: env.API_BASE_URL,
});
