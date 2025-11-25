"use client";

import { useMutation, type UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { clearOnTokenExpired, setOnTokenExpired } from "@/lib/configs";
import { AUTH_MESSAGES, ROUTES } from "@/lib/constants";
import { useToast } from "@/lib/hooks";
import { authService } from "@/lib/services";
import { ApiResponse, AuthResponse, LoginCredentials, User } from "@/lib/types";
import { authCookies } from "@/lib/utils/cookies.utils";
import { isTokenValid } from "@/lib/utils/token.utils";

const USER_STORAGE_KEY = "auth_user";

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<{ message: string }>>;
  logoutSilently: () => void;
  loginMutation: UseMutationResult<ApiResponse<AuthResponse>, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<ApiResponse<{ message: string }>, Error, void>;
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
  const queryClient = useQueryClient();
  const { error: showError, success } = useToast();

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = authCookies.get();
        if (storedToken) {
          const isValid = isTokenValid(storedToken);
          if (isValid) {
            setToken(storedToken);
            const storedUser = getStoredUser();
            if (storedUser) {
              setUser(storedUser);
            }
          } else {
            authCookies.remove();
            if (typeof window !== "undefined") {
              localStorage.removeItem(USER_STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
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
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    queryClient.clear();
    router.push(ROUTES.LOGIN);
  }, [router, queryClient]);

  useEffect(() => {
    setOnTokenExpired(logoutSilently);

    return () => {
      clearOnTokenExpired();
    };
  }, [logoutSilently]);

  const loginMutation = useMutation<ApiResponse<AuthResponse>, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (result: ApiResponse<AuthResponse>) => {
      if (result.status === "success" && result.data?.accessToken) {
        setToken(result.data.accessToken);
        authCookies.set(result.data.accessToken);
        if (result.data.user) {
          setUser(result.data.user);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.data.user));
        }
        success(AUTH_MESSAGES.LOGIN_SUCCESS);
        router.push(ROUTES.DASHBOARD);
      }
    },
    onError: (error: Error) => {
      showError(error.message || AUTH_MESSAGES.LOGIN_FAILED);
    },
  });

  const logoutMutation = useMutation<ApiResponse<{ message: string }>, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setToken(null);
      setUser(null);
      authCookies.remove();
      localStorage.removeItem(USER_STORAGE_KEY);
      queryClient.clear();
      success(AUTH_MESSAGES.LOGOUT_SUCCESS);
      router.push(ROUTES.LOGIN);
    },
    onError: (error: Error) => {
      showError(error.message || AUTH_MESSAGES.LOGOUT_FAILED);
      setToken(null);
      setUser(null);
      authCookies.remove();
      localStorage.removeItem(USER_STORAGE_KEY);
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = async (): Promise<ApiResponse<{ message: string }>> => {
    return logoutMutation.mutateAsync();
  };

  const isMutating = loginMutation.isPending || logoutMutation.isPending;
  const isLoadingState = !isHydrated || isLoading || isMutating;

  const value: AuthContextType = {
    token: isHydrated ? token : null,
    user: isHydrated ? user : null,
    isAuthenticated: isHydrated ? !!token : false,
    isLoading: isLoadingState,
    login,
    logout,
    logoutSilently,
    loginMutation,
    logoutMutation,
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
