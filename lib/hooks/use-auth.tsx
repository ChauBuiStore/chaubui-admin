"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { clearOnTokenExpired, setOnTokenExpired } from "@/lib/configs";
import { ROUTES } from "@/lib/constants";
import { authService } from "@/lib/services";
import { ApiResponse, AuthResponse, LoginCredentials, User } from "@/lib/types";
import { authCookies } from "@/lib/utils/cookies.utils";
import { isTokenValid, parseJWTToken } from "@/lib/utils/token.utils";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<{ message: string }>>;
  logoutSilently: () => void;
  getCurrentUser: () => Promise<ApiResponse<User>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children = null }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
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
            const tokenInfo = parseJWTToken(storedToken);
            if (tokenInfo.payload) {
              setUser(tokenInfo.payload);
            }
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
    setUser(null);
    authCookies.remove();
    router.push(ROUTES.LOGIN);
  }, [router]);

  useEffect(() => {
    setOnTokenExpired(logoutSilently);

    return () => {
      clearOnTokenExpired();
    };
  }, [logoutSilently]);

  const getCurrentUser = async (): Promise<ApiResponse<User>> => {
    try {
      const result = await authService.me();
      if (result.status === "success" && result.data) {
        setUser(result.data);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);

      if (result.status === "success" && result.data?.accessToken) {
        setToken(result.data.accessToken);
        authCookies.set(result.data.accessToken);
        await getCurrentUser();
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<ApiResponse<{ message: string }>> => {
    setIsLoading(true);
    try {
      const result = await authService.logout();
      setToken(null);
      setUser(null);
      authCookies.remove();
      router.push(ROUTES.LOGIN);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    token: isHydrated ? token : null,
    user: isHydrated ? user : null,
    isAuthenticated: isHydrated ? !!token : false,
    isLoading: !isHydrated || isLoading,
    login,
    logout,
    logoutSilently,
    getCurrentUser,
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
