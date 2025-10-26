import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse, AuthResponse, LoginCredentials, User } from "@/lib/types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await authFetcher.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await authFetcher.post<{ message: string }>(ENDPOINTS.AUTH.LOGOUT);
    return response;
  },
  me: async (): Promise<ApiResponse<User>> => {
    const response = await authFetcher.get<User>(ENDPOINTS.AUTH.ME);
    return response;
  },
};
