"use client";

import { useAuth } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { isTokenValid } from "@/lib/utils/token-validation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, logoutSilently } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { error } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      if (!isLoading) {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          if (isAuthenticated) {
            error("Your session has expired. Please login again.");
          }
          router.replace("/login");
          return;
        }

        if (!isTokenValid(token)) {
          error("Invalid or expired token. Please login again.");
          logoutSilently();
          router.replace("/login");
          return;
        }
      }
    };

    checkAuth();

    const interval = setInterval(checkAuth, 30000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated, isLoading, router, error, logoutSilently]);

  useEffect(() => {
    if (!isLoading && pathname) {
      const token = localStorage.getItem("auth_token");

      if (!token || !isTokenValid(token)) {
        if (token && !isTokenValid(token)) {
          error("Invalid or expired token. Please login again.");
          logoutSilently();
        }
        router.replace("/login");
      }
    }
  }, [pathname, isLoading, router, error, logoutSilently]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
