import { AuthResponse, LoginCredentials } from '@/lib/types/auth';
import { ENDPOINTS } from '../config/endpoints';
import { httpClient } from '../config/http-client';

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
