"use client";

import { XLabel } from "@/components/common";
import { Checkbox } from "@/components/ui";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface XCheckboxProps extends React.ComponentProps<typeof Checkbox> {
  label?: string;
  helperText?: string;
  error?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
}

export const XCheckbox = forwardRef<HTMLButtonElement, XCheckboxProps>(
  ({ 
    label, 
    helperText, 
    error = false, 
    wrapperClassName, 
    labelClassName, 
    helperTextClassName,
    className,
    ...props 
  }, ref) => {
    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        <div className="flex items-center space-x-2">
          <Checkbox
            ref={ref}
            className={cn(
              error && "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive",
              className
            )}
            {...props}
          />
          {label && (
            <XLabel
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error && "text-destructive",
                labelClassName
              )}
              htmlFor={props.id}
            >
              {label}
            </XLabel>
          )}
        </div>
        {helperText && (
          <p className={cn(
            "text-xs text-muted-foreground",
            error && "text-destructive",
            helperTextClassName
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

XCheckbox.displayName = "XCheckbox";

export default XCheckbox;
