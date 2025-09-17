"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface XSelectPaginationProps {
  options: SelectOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onLoadMore?: () => void;
  loading?: boolean;
  loadThreshold?: number;
  hasMoreData?: boolean;
  multiple?: boolean;
}

export function XSelectPagination({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  onLoadMore,
  loading = false,
  loadThreshold = 50,
  hasMoreData = false,
  multiple = false,
}: XSelectPaginationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (hasMoreData && !loading) {
      onLoadMore?.();
    }
  }, [hasMoreData, loading, onLoadMore]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleValueChange = (newValue: string) => {
    if (!multiple) {
      onValueChange?.(newValue);
      return;
    }

    const currentValues = Array.isArray(value) ? value : [];
    const isSelected = currentValues.includes(newValue);
    
    let newValues: string[];
    if (isSelected) {
      newValues = currentValues.filter(v => v !== newValue);
    } else {
      newValues = [...currentValues, newValue];
    }
    
    onValueChange?.(newValues);
  };

  const removeValue = (valueToRemove: string) => {
    if (!multiple) return;
    
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.filter(v => v !== valueToRemove);
    onValueChange?.(newValues);
  };

  const getSelectedLabels = () => {
    if (!multiple || !Array.isArray(value)) return [];
    
    return value.map(val => {
      const option = options.find(opt => opt.value === val);
      return option?.label || val;
    });
  };

  const isOptionSelected = (optionValue: string) => {
    if (!multiple) return value === optionValue;
    return Array.isArray(value) && value.includes(optionValue);
  };

  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;

    const scrollElement = scrollRef.current;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearBottom =
        scrollTop + clientHeight >= scrollHeight - loadThreshold;

      if (isNearBottom && hasMoreData && !loading) {
        handleLoadMore();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [isOpen, hasMoreData, loading, loadThreshold, handleLoadMore]);

  if (multiple) {
    const selectedLabels = getSelectedLabels();
    
    return (
      <div className={cn("w-full relative", className)}>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full h-auto min-h-[40px] px-3 py-2 text-left font-normal",
            !selectedLabels.length && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <div className="flex items-start justify-between w-full gap-2">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden">
              {selectedLabels.length > 0 ? (
                selectedLabels.map((label, index) => {
                  const val = Array.isArray(value) ? value[index] : '';
                  return (
                    <Badge key={val} variant="secondary" className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 max-w-[140px]">
                      <span className="truncate">{label}</span>
                      <div
                        className="h-3 w-3 p-0 hover:bg-transparent ml-1 flex-shrink-0 cursor-pointer flex items-center justify-center rounded-sm hover:bg-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeValue(val);
                        }}
                      >
                        <X className="h-2 w-2" />
                      </div>
                    </Badge>
                  );
                })
              ) : (
                <span className="truncate">{placeholder}</span>
              )}
            </div>
            <div className="flex-shrink-0 mt-1">
              {isOpen ? (
                <ChevronUp className="h-4 w-4 opacity-50" />
              ) : (
                <ChevronDown className="h-4 w-4 opacity-50" />
              )}
            </div>
          </div>
        </Button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[300px]">
            <div ref={scrollRef} className="max-h-[250px] overflow-y-auto p-1">
              {options.map((option) => {
                const isSelected = isOptionSelected(option.value);
                return (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center space-x-2 px-2 py-2 text-sm cursor-pointer rounded-sm hover:bg-accent",
                      isSelected && "bg-accent"
                    )}
                    onClick={() => handleValueChange(option.value)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {}}
                      className="pointer-events-none"
                    />
                    <span className="flex-1">{option.label}</span>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              )}
            </div>
          </div>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <Select
      value={value as string}
      onValueChange={(value) => onValueChange?.(value)}
      open={isOpen}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <div ref={scrollRef} className="max-h-[250px] overflow-y-auto">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}

          {loading && (
            <div className="flex items-center justify-center p-2 text-sm text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
