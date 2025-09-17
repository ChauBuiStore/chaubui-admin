import { AuthResponse, LoginCredentials } from '@/lib/types/auth.type';
import { ENDPOINTS } from '../configs/endpoints';
import { httpClient } from '../configs/http-client';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data as AuthResponse;
  }

  async logout(): Promise<{ message: string }> {
    const response = await httpClient.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data as { message: string };
  }
}

export const authService = new AuthService();
export default authService;
