"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface XCardProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  variant?: "default" | "outline" | "elevated" | "ghost";
  wrapperClassName?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const XCard = forwardRef<HTMLDivElement, XCardProps>(
  (
    {
      variant = "default",
      wrapperClassName,
      className,
      children,
      title,
      description,
      action,
      headerClassName,
      contentClassName,
      titleClassName,
      descriptionClassName,
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

    return (
      <div className={cn(wrapperClassName)}>
        <Card
          ref={ref}
          className={cn(
            variantClasses[variant],
            className
          )}
          {...props}
        >
          {(title || description || action) && (
            <CardHeader className={cn(headerClassName)}>
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  {title && (
                    <CardTitle
                      className={cn(
                        "text-2xl font-semibold leading-none tracking-tight",
                        titleClassName
                      )}
                    >
                      {title}
                    </CardTitle>
                  )}
                  {description && (
                    <CardDescription
                      className={cn(
                        "text-sm text-muted-foreground",
                        descriptionClassName
                      )}
                    >
                      {description}
                    </CardDescription>
                  )}
                </div>
                {action && <div className="flex items-center">{action}</div>}
              </div>
            </CardHeader>
          )}

          {children && (
            <CardContent className={cn(contentClassName)}>
              {children}
            </CardContent>
          )}
        </Card>
      </div>
    );
  }
);

XCard.displayName = "XCard";

export default XCard;
