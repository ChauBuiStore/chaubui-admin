export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  dateOfBirth: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  address: string;
  gender: string | null;
}
