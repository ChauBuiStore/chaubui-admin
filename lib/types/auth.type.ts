export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  sub: string; // user.id
  email: string;
  role: string;
  iat?: number; // issued at (timeline từ JWT)
  exp?: number; // expires at (timeline từ JWT)
}
