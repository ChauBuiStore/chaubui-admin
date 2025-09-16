'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/lib/services/auth-service';
import { LoginCredentials, AuthResponse } from '@/lib/types/auth';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children = null }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch {
      } finally {
        setIsLoading(false);
        setIsHydrated(true);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);

      if (result.data.accessToken) {
        setToken(result.data.accessToken);
        localStorage.setItem("auth_token", result.data.accessToken);
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<{ message: string }> => {
    setIsLoading(true);
    try {
      const result = await authService.logout();
      setToken(null);
      localStorage.removeItem("auth_token");
      return result
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    token: isHydrated ? token : null,
    isAuthenticated: isHydrated ? !!token : false,
    isLoading: !isHydrated || isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
