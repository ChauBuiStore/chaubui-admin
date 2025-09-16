"use client";

import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  const toast = (message: string, options?: { type?: "success" | "error" | "warning" | "info" }) => {
    const { type = "info" } = options || {};
    
    switch (type) {
      case "success":
        return sonnerToast.success(message);
      case "error":
        return sonnerToast.error(message);
      case "warning":
        return sonnerToast.warning(message);
      case "info":
      default:
        return sonnerToast.info(message);
    }
  };

  return {
    toast,
    success: (message: string) => sonnerToast.success(message),
    error: (message: string) => sonnerToast.error(message),
    warning: (message: string) => sonnerToast.warning(message),
    info: (message: string) => sonnerToast.info(message),
    loading: (message: string) => sonnerToast.loading(message),
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
    promise: <T,>(promise: Promise<T>, messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }) => sonnerToast.promise(promise, messages),
  };
};
