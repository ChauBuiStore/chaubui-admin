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

  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async parseErrorResponse(response: Response): Promise<never> {
    let errorData;
    try {
      const text = await response.text();
      errorData = text ? JSON.parse(text) : {};
    } catch {
      errorData = {
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    throw new Error(errorData.message || "Request failed");
  }

  private async parseSuccessResponse<T>(
    response: Response
  ): Promise<{ data: T }> {
    if (response.status === 204 || response.status === 205) {
      return { data: null as T };
    }

    const text = await response.text();
    if (!text) {
      return { data: null as T };
    }

    try {
      const data = JSON.parse(text);
      return { data };
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<{ data: T }> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = { ...this.getAuthHeaders(), ...options.headers };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { params: _params, ...fetchOptions } = options;

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      await this.parseErrorResponse(response);
    }

    return this.parseSuccessResponse<T>(response);
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

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestConfig
  ): Promise<{ data: T }> {
    const url = this.buildUrl(endpoint, options?.params);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...this.config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { params: _params, ...fetchOptions } = options || {};

    const response = await fetch(url, {
      ...fetchOptions,
      method: "POST",
      body: formData,
      headers,
    });

    if (!response.ok) {
      await this.parseErrorResponse(response);
    }

    return this.parseSuccessResponse<T>(response);
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

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestConfig
  ): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
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
