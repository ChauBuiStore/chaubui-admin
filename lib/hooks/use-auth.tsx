"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { httpClient } from "@/lib/configs";
import { ROUTES } from "@/lib/constants";
import { AuthService } from "@/lib/services";
import { ApiResponse, AuthResponse, LoginCredentials } from "@/lib/types";
import { authCookies } from "@/lib/utils/cookies.utils";
import { isTokenValid } from "@/lib/utils/token.utils";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<{ message: string }>>;
  logoutSilently: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children = null }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = authCookies.get();
        if (storedToken) {
          const isValid = isTokenValid(storedToken);
          if (isValid) {
            setToken(storedToken);
          } else {
            authCookies.remove();
          }
        }
      } catch {
      } finally {
        setIsLoading(false);
        setIsHydrated(true);
      }
    };

    initAuth();
  }, []);

  const logoutSilently = useCallback(() => {
    setToken(null);
    authCookies.remove();
    router.push(ROUTES.LOGIN);
  }, [router]);

  useEffect(() => {
    if (httpClient && typeof httpClient === "object" && "setOnTokenExpired" in httpClient) {
      httpClient.setOnTokenExpired(logoutSilently);
    }

    return () => {
      if (httpClient && typeof httpClient === "object" && "clearOnTokenExpired" in httpClient) {
        httpClient.clearOnTokenExpired();
      }
    };
  }, [logoutSilently]);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(credentials);

      if (result.status === "success" && result.data?.accessToken) {
        setToken(result.data.accessToken);
        authCookies.set(result.data.accessToken);
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<ApiResponse<{ message: string }>> => {
    setIsLoading(true);
    try {
      const result = await AuthService.logout();
      setToken(null);
      authCookies.remove();
      router.push(ROUTES.LOGIN);
      return result;
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
    logoutSilently,
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
