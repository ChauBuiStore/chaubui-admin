import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse, AuthResponse, LoginCredentials } from "@/lib/types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await authFetcher.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await authFetcher.post<{ message: string }>(ENDPOINTS.AUTH.LOGOUT);
    return response;
  },
};
