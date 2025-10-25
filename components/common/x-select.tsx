"use client";

import { ChevronDown, X } from "lucide-react";
import React from "react";

import { XBadge, XButton } from "@/components/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface XSelectProps {
  options: SelectOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  hasError?: boolean;
}

export function XSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  multiple = false,
  hasError = false,
}: XSelectProps) {
  const removeValue = (valueToRemove: string) => {
    if (!multiple) return;

    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.filter((v) => v !== valueToRemove);
    onValueChange?.(newValues);
  };

  const getSelectedLabels = () => {
    if (!multiple || !Array.isArray(value)) return [];

    return value.map((val) => {
      const option = options.find((opt) => opt.value === val);
      return option?.label || val;
    });
  };

  if (multiple) {
    const selectedLabels = getSelectedLabels();

    return (
      <div className={cn("w-full relative", className)}>
        <XButton
          type="button"
          variant="outline"
          className={cn(
            "w-full h-auto min-h-[40px] px-3 py-2 text-left font-normal",
            !selectedLabels.length && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50",
            hasError && "border-red-500",
          )}
          disabled={disabled}
        >
          <div className="flex items-start justify-between w-full gap-2">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden">
              {selectedLabels.length > 0 ? (
                selectedLabels.map((label, index) => {
                  const val = Array.isArray(value) ? value[index] : "";
                  return (
                    <XBadge
                      key={val}
                      variant="secondary"
                      className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 max-w-[140px]"
                    >
                      <span className="truncate">{label}</span>
                      <div
                        className="h-3 w-3 p-0 hover:bg-transparent ml-1 flex-shrink-0 cursor-pointer flex items-center justify-center rounded-sm hover:bg-muted"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          removeValue(val);
                        }}
                      >
                        <X className="h-2 w-2" />
                      </div>
                    </XBadge>
                  );
                })
              ) : (
                <span className="truncate">{placeholder}</span>
              )}
            </div>
            <div className="flex-shrink-0 mt-1">
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </div>
        </XButton>
      </div>
    );
  }

  return (
    <Select
      value={value ? String(value) : ""}
      onValueChange={(newValue: string) => {
        if (newValue && newValue.trim() !== "") {
          onValueChange?.(newValue);
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", hasError && "border-destructive", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
