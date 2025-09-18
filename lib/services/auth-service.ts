import { ENDPOINTS, httpClient } from "@/lib/configs";
import { AuthResponse, LoginCredentials } from "@/lib/types";

class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data as AuthResponse;
  }

  static async logout(): Promise<{ message: string }> {
    const response = await httpClient.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data as { message: string };
  }
}

export default AuthService;