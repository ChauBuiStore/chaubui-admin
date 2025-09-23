"use client";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface XCardProps extends React.ComponentProps<typeof Card> {
  variant?: "default" | "outline" | "elevated" | "ghost";
  size?: "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
}

export const XCard = forwardRef<HTMLDivElement, XCardProps>(
  (
    {
      variant = "default",
      size = "md",
      padding = "md",
      rounded = "md",
      shadow = "md",
      hover = false,
      clickable = false,
      loading = false,
      disabled = false,
      wrapperClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-card border-border",
      outline: "bg-transparent border-2",
      elevated: "bg-card border-0 shadow-lg",
      ghost: "bg-transparent border-0",
    };

    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
    };

    const paddingClasses = {
      none: "p-0",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
    };

    const roundedClasses = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    };

    const shadowClasses = {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    };

    return (
      <div className={cn(sizeClasses[size], wrapperClassName)}>
        <Card
          ref={ref}
          className={cn(
            variantClasses[variant],
            paddingClasses[padding],
            roundedClasses[rounded],
            shadowClasses[shadow],
            hover && "hover:shadow-lg hover:scale-[1.02] transition-all duration-200",
            clickable && "cursor-pointer",
            loading && "opacity-50 cursor-not-allowed",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </div>
    );
  }
);

XCard.displayName = "XCard";

export default XCard;
