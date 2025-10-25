"use client";

import React, { forwardRef, useState } from "react";

import { XLabel } from "@/components/common";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface XInputNumberProps
  extends Omit<React.ComponentProps<typeof Input>, "size" | "type" | "value" | "onChange"> {
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
  inputClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  value?: number | string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
  precision?: number;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  onChange?: (value: number | null) => void;
  onValueChange?: (value: string) => void;
}

export const XInputNumber = forwardRef<HTMLInputElement, XInputNumberProps>(
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
      inputClassName,
      errorClassName,
      helperClassName,
      className,
      value,
      defaultValue,
      min,
      max,
      precision,
      allowNegative = true,
      allowDecimal = true,
      onChange,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<string>(() => {
      if (value !== undefined) return String(value);
      if (defaultValue !== undefined) return String(defaultValue);
      return "";
    });

    const displayValue = value !== undefined ? String(value) : internalValue;

    const sizeClasses = {
      sm: "h-8 px-2 text-xs",
      md: "h-9 px-3 text-sm",
      lg: "h-10 px-4 text-base",
    };

    const isValidNumber = (val: string): boolean => {
      if (val === "" || val === "-") return true;

      const decimalPattern = allowDecimal ? /^-?\d*\.?\d*$/ : /^-?\d*$/;

      if (!decimalPattern.test(val)) return false;

      if (!allowNegative && val.startsWith("-")) return false;

      return true;
    };

    const formatNumber = (val: number): number => {
      if (precision !== undefined) {
        return Number(val.toFixed(precision));
      }
      return val;
    };

    const parseValue = (val: string): number | null => {
      if (val === "" || val === "-") return null;
      const parsed = Number(val);
      if (isNaN(parsed)) return null;
      return parsed;
    };

    const clampValue = (val: number): number => {
      let clamped = val;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      return formatNumber(clamped);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (newValue === "") {
        if (value === undefined) setInternalValue("");
        onValueChange?.(newValue);
        onChange?.(null);
        return;
      }

      if (!isValidNumber(newValue)) return;

      if (value === undefined) setInternalValue(newValue);
      onValueChange?.(newValue);

      const parsed = parseValue(newValue);
      if (parsed !== null) {
        onChange?.(clampValue(parsed));
      } else {
        onChange?.(null);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const currentValue = e.target.value;
      const parsed = parseValue(currentValue);

      if (parsed !== null) {
        const clamped = clampValue(parsed);
        const formatted = String(clamped);

        if (value === undefined) setInternalValue(formatted);
        onChange?.(clamped);
      } else if (currentValue === "-") {
        if (value === undefined) setInternalValue("");
        onChange?.(null);
      }

      props.onBlur?.(e);
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
              labelClassName,
            )}
          >
            {label}
          </XLabel>
        )}

        <div className="relative">
          <Input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={cn(
              sizeClasses[size],
              hasError ? "border-destructive focus:border-destructive focus:ring-destructive" : "",
              disabled ? "bg-muted cursor-not-allowed" : "bg-background",
              readOnly ? "bg-muted cursor-default" : "",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              inputClassName,
              className,
            )}
            disabled={disabled}
            readOnly={readOnly}
            {...props}
          />
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

XInputNumber.displayName = "XInputNumber";

export default XInputNumber;
