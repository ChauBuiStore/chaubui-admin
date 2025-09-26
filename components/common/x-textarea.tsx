"use client";

import { XLabel } from "@/components/common";
import { Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface XTextareaProps
  extends Omit<React.ComponentProps<typeof Textarea>, "size"> {
  size?: "sm" | "md" | "lg";
  hasError?: boolean;
  errorMessage?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  rows?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

export const XTextarea = forwardRef<HTMLTextAreaElement, XTextareaProps>(
  (
    {
      size = "md",
      hasError = false,
      errorMessage,
      label,
      disabled = false,
      readOnly = false,
      helperText,
      required = false,
      wrapperClassName,
      labelClassName,
      textareaClassName,
      errorClassName,
      helperClassName,
      className,
      rows = 3,
      resize = "vertical",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "min-h-[60px] px-2 py-1 text-xs",
      md: "min-h-[80px] px-3 py-2 text-sm",
      lg: "min-h-[100px] px-4 py-3 text-base",
    };

    const resizeClasses = {
      none: "resize-none",
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
    };

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {label && (
          <XLabel
            required={required}
            error={hasError}
            className={cn(
              "text-sm font-medium text-foreground",
              disabled && "text-muted-foreground",
              labelClassName
            )}
          >
            {label}
          </XLabel>
        )}

        <Textarea
          ref={ref}
          rows={rows}
          className={cn(
            sizeClasses[size],
            resizeClasses[resize],
            hasError
              ? "border-destructive focus:border-destructive focus:ring-destructive"
              : "",
            disabled ? "bg-muted cursor-not-allowed" : "",
            readOnly ? "bg-muted cursor-default" : "",
            textareaClassName,
            className
          )}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />

        {hasError && errorMessage && (
          <p className={cn("text-xs text-destructive", errorClassName)}>
            {errorMessage}
          </p>
        )}

        {!hasError && helperText && (
          <p className={cn("text-xs text-muted-foreground", helperClassName)}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

XTextarea.displayName = "XTextarea";

export default XTextarea;
