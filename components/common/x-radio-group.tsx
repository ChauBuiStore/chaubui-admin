"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface XRadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  label?: string;
  description?: string;
  error?: string;
}

export function XRadioGroup({
  options,
  value,
  onValueChange,
  orientation = "vertical",
  size = "md",
  className,
  disabled = false,
  name,
  required = false,
  label,
  description,
  error,
}: XRadioGroupProps) {
  const sizeClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  const orientationClasses = {
    horizontal: "flex flex-row flex-wrap",
    vertical: "flex flex-col",
  };

  const itemSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FormLabel>
      )}

      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}

      <FormControl>
        <div className={cn(
          orientationClasses[orientation],
          sizeClasses[size],
          className
        )}>
          <RadioGroup
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            name={name}
            className="contents"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.value}
                  id={`${name || "radio"}-${option.value}`}
                  disabled={disabled || option.disabled}
                  className={cn(
                    size === "sm" && "size-3",
                    size === "md" && "size-4",
                    size === "lg" && "size-5"
                  )}
                />
                <div className="flex flex-col">
                  <label
                    htmlFor={`${name || "radio"}-${option.value}`}
                    className={cn(
                      "font-medium cursor-pointer",
                      itemSizeClasses[size],
                      (disabled || option.disabled) &&
                        "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {option.label}
                  </label>
                  {option.description && (
                    <p className={cn(
                      "text-muted-foreground mt-1",
                      size === "sm" && "text-xs",
                      size === "md" && "text-sm",
                      size === "lg" && "text-base",
                      (disabled || option.disabled) && "opacity-50",
                    )}>
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </FormControl>

      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
