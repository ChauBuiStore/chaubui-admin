import { ENDPOINTS, httpClient } from "@/lib/configs";
import { AuthResponse, LoginCredentials, ApiResponse } from "@/lib/types";

class AuthService {
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  }

  static async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await httpClient.post<{ message: string }>(ENDPOINTS.AUTH.LOGOUT);
    return response;
  }
}

export default AuthService;