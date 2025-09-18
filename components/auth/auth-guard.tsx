'use client';

import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/lib/hooks/use-toast';
import { isTokenValid } from '@/lib/utils/token-validation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { error } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Check if token was removed due to expiration
      const token = localStorage.getItem("auth_token");
      if (!token) {
        error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router, error]);

  // Additional check for token validity even if it exists
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const token = localStorage.getItem("auth_token");
      if (token && !isTokenValid(token)) {
        error("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("auth_token");
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router, error]);

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

