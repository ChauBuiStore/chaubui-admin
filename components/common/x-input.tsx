"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { forwardRef, useState } from "react";

import { XButton, XLabel } from "@/components/common";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface XInputProps extends Omit<React.ComponentProps<typeof Input>, "size"> {
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
  hideSpinner?: boolean;
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
      hideSpinner = false,
      wrapperClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      helperClassName,
      className,
      type = "text",
      ...props
    },
    ref,
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

    const isNumberType = type === "number";
    const shouldHideSpinner = isNumberType && hideSpinner;

    return (
      <div className={cn("space-y-1", wrapperClassName)}>
        {label && (
          <XLabel
            required={required}
            error={hasError}
            className={cn(
              "text-sm font-medium text-foreground",
              disabled && "text-muted-foreground",
              labelClassName,
            )}
          >
            {label}
          </XLabel>
        )}

        <div className="relative">
          {hasLeftContent && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
              {leftIcon}
              {prefix && <span className="text-sm">{prefix}</span>}
            </div>
          )}

          <Input
            ref={ref}
            type={currentType}
            className={cn(
              sizeClasses[size],
              hasLeftContent ? "pl-10" : "",
              hasRightContent ? "pr-10" : "",
              hasError ? "border-destructive focus:border-destructive focus:ring-destructive" : "",
              disabled ? "bg-muted cursor-not-allowed" : "",
              readOnly ? "bg-muted cursor-default" : "",
              shouldHideSpinner
                ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                : "",
              inputClassName,
              className,
            )}
            disabled={disabled}
            readOnly={readOnly}
            {...props}
          />

          {hasRightContent && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {rightIcon}

              {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}

              {shouldShowPasswordToggle && (
                <XButton
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
                </XButton>
              )}
            </div>
          )}
        </div>

        {hasError && errorMessage && (
          <p className={cn("text-xs text-destructive", errorClassName)}>{errorMessage}</p>
        )}

        {!hasError && helperText && (
          <p className={cn("text-xs text-muted-foreground", helperClassName)}>{helperText}</p>
        )}
      </div>
    );
  },
);

XInput.displayName = "XInput";

export default XInput;
