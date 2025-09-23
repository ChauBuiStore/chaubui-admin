"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React, { forwardRef } from "react";

export interface XButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size"> {
  size?: "sm" | "md" | "lg";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  wrapperClassName?: string;
}

export const XButton = forwardRef<HTMLButtonElement, XButtonProps>(
  (
    {
      size = "md",
      variant = "default",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      wrapperClassName,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-6 text-base",
    };

    return (
      <div className={cn(fullWidth && "w-full", wrapperClassName)}>
        <Button
          ref={ref}
          variant={variant}
          disabled={disabled || loading}
          className={cn(
            sizeClasses[size],
            fullWidth && "w-full",
            loading && "cursor-not-allowed",
            className
          )}
          {...props}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Button>
      </div>
    );
  }
);

XButton.displayName = "XButton";

export default XButton;
