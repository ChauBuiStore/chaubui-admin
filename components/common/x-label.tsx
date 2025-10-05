"use client";

import React, { forwardRef } from "react";

import { Label } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface XLabelProps extends React.ComponentProps<typeof Label> {
  required?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
}

export const XLabel = forwardRef<HTMLLabelElement, XLabelProps>(
  ({ required = false, error = false, helperText, className, children, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <Label
          ref={ref}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error && "text-destructive",
            className,
          )}
          {...props}
        >
          {children}
          {required && <span className="text-destructive">*</span>}
        </Label>
        {helperText && (
          <p className={cn("text-xs text-muted-foreground", error && "text-destructive")}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

XLabel.displayName = "XLabel";

export default XLabel;
