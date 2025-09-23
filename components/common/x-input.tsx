"use client";

import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { forwardRef, useState } from "react";

export interface XInputProps
  extends Omit<React.ComponentProps<typeof Input>, "size"> {
  size?: "sm" | "md" | "lg";
  hasError?: boolean;
  errorMessage?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: string;
  required?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

export const XInput = forwardRef<HTMLInputElement, XInputProps>(
  (
    {
      size = "md",
      hasError = false,
      errorMessage,
      label,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      disabled = false,
      readOnly = false,
      helperText,
      required = false,
      showPassword = false,
      onTogglePassword,
      wrapperClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      helperClassName,
      className,
      type = "text",
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordType = type === "password";
    const shouldShowPasswordToggle = isPasswordType && !disabled && !readOnly;
    const sizeClasses = {
      sm: "h-8 px-2 text-xs",
      md: "h-9 px-3 text-sm",
      lg: "h-10 px-4 text-base",
    };

    const hasLeftContent = leftIcon || prefix;
    const hasRightContent = rightIcon || suffix || shouldShowPasswordToggle;

    const handleTogglePassword = () => {
      if (onTogglePassword) {
        onTogglePassword();
      } else {
        setIsPasswordVisible(!isPasswordVisible);
      }
    };

    const currentType = isPasswordType
      ? showPassword || isPasswordVisible
        ? "text"
        : "password"
      : type;

    return (
      <>
        {label && (
          <label
            className={cn(
              "text-sm font-medium text-foreground",
              hasError && "text-destructive",
              disabled && "text-muted-foreground",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {hasLeftContent && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
            {leftIcon}
            {prefix && <span className="text-sm">{prefix}</span>}
          </div>
        )}

        <div className="relative mb-0">
          <Input
            ref={ref}
            type={currentType}
            className={cn(
              sizeClasses[size],
              hasLeftContent ? "pl-10" : "",
              hasRightContent ? "pr-10" : "",
              hasError
                ? "border-destructive focus:border-destructive focus:ring-destructive"
                : "",
              disabled ? "bg-muted cursor-not-allowed" : "",
              readOnly ? "bg-muted cursor-default" : "",
              inputClassName,
              className
            )}
            disabled={disabled}
            readOnly={readOnly}
            {...props}
          />

          {hasRightContent && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {rightIcon}

              {suffix && (
                <span className="text-sm text-muted-foreground">{suffix}</span>
              )}

              {shouldShowPasswordToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleTogglePassword}
                  className="text-muted-foreground hover:text-foreground !bg-transparent transition-colors"
                  tabIndex={-1}
                >
                  {showPassword || isPasswordVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {!hasError && helperText && (
          <p className={cn("text-xs text-muted-foreground", helperClassName)}>
            {helperText}
          </p>
        )}
      </>
    );
  }
);

XInput.displayName = "XInput";

export default XInput;
