"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface XSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
  children?: ReactNode;
  id?: string;
}

export function XSwitch({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  label,
  description,
  children,
  id,
}: XSwitchProps) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  const switchElement = (
    <Switch
      id={switchId}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={className}
    />
  );

  if (children) {
    return (
      <div className="flex items-center space-x-2">
        {switchElement}
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  if (label || description) {
    return (
      <div className="flex items-start space-x-3">
        {switchElement}
        <div className="flex-1 space-y-1">
          {label && (
            <Label
              htmlFor={switchId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                disabled && "cursor-not-allowed opacity-70"
              )}
            >
              {label}
            </Label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return switchElement;
}
