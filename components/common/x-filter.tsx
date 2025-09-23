"use client";

import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";
import { useSearchParams } from "@/lib/hooks";
import { SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface FilterOption {
  key: string;
  label: string;
  value: string;
  type: "select" | "input" | "checkbox" | "radio";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

interface SearchConfig {
  enabled?: boolean;
  columnKey: string;
  placeholder?: string;
  className?: string;
}

interface XFilterProps {
  filters: FilterOption[];
  onApply?: (filters: Record<string, string | string[]>) => void;
  onReset?: () => void;
  triggerText?: string;
  filterValues?: Record<string, string | string[]>;
  setFilter?: (key: string, value: string | string[]) => void;
  clearFilters?: () => void;
  searchConfig?: SearchConfig;
  onSearchChange?: (searchTerm: string) => void;
  isLoading?: boolean;
  className?: string;
}

const SearchInput = ({
  searchConfig,
  value,
  onValueChange,
  onSearch,
  isLoading = false,
}: {
  searchConfig: SearchConfig;
  value: string;
  onValueChange: (value: string) => void;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
  }, [onValueChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      onSearch?.(value);
    }
  }, [value, onSearch, isLoading]);

  return (
    <Input
      placeholder={searchConfig.placeholder || "Search..."}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={isLoading}
      aria-label="Search input"
      className={`border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full sm:w-80 lg:w-96 ${
        searchConfig.className || ""
      }`}
    />
  );
};

export function XFilter({
  filters,
  onApply,
  onReset,
  triggerText = "Advanced Search",
  filterValues,
  setFilter,
  clearFilters,
  searchConfig,
  onSearchChange,
  isLoading = false,
  className = "",
}: XFilterProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilterValues, setTempFilterValues] = useState<
    Record<string, string | string[]>
  >({});

  const fallbackSearchParams = useSearchParams();
  const finalFilterValues = filterValues || fallbackSearchParams.filters;
  const finalSetFilter = setFilter || fallbackSearchParams.setFilter;
  const finalClearFilters = clearFilters || fallbackSearchParams.clearFilters;

  const cleanFilterValues = useMemo(() => {
    if (!finalFilterValues) return {};
    return Object.entries(finalFilterValues)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .reduce((acc, [key, value]) => {
        acc[key] = value as string | string[];
        return acc;
      }, {} as Record<string, string | string[]>);
  }, [finalFilterValues]);

  useEffect(() => {
    if (filterOpen) {
      setTempFilterValues(cleanFilterValues);
    }
  }, [filterOpen, cleanFilterValues]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    const newValue = value === "all" ? "" : value;
    setTempFilterValues((prev) => ({ ...prev, [key]: newValue }));
  }, []);

  const handleInputChange = useCallback((key: string, value: string) => {
    setTempFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCheckboxChange = useCallback((
    key: string,
    value: string,
    checked: boolean
  ) => {
    setTempFilterValues((prev) => {
      const currentValues = Array.isArray(prev?.[key]) ? prev[key] as string[] : [];
      const newValues = checked 
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      return { ...prev, [key]: newValues };
    });
  }, []);

  const handleRadioChange = useCallback((key: string, value: string) => {
    setTempFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApply = useCallback(() => {
    if (!finalSetFilter) {
      console.warn("setFilter function is not available");
      return;
    }

    try {
      Object.entries(tempFilterValues).forEach(([key, value]) => {
        finalSetFilter(key, value);
      });

      finalSetFilter("page", "1");
      onApply?.(tempFilterValues);
      setFilterOpen(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  }, [tempFilterValues, finalSetFilter, onApply]);

  const handleReset = useCallback(() => {
    if (!finalClearFilters || !finalSetFilter) {
      console.warn("clearFilters or setFilter function is not available");
      return;
    }

    try {
      setTempFilterValues({});
      finalClearFilters();
      finalSetFilter("page", "1");
      onReset?.();
      setFilterOpen(false);
    } catch (error) {
      console.error("Error resetting filters:", error);
    }
  }, [finalClearFilters, finalSetFilter, onReset]);

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center border rounded-full p-1 gap-2 sm:gap-0 ${className}`}>
      {searchConfig?.enabled && (
        <div className="flex-1 min-w-0">
          <SearchInput
            searchConfig={searchConfig}
            value={
              tempFilterValues?.[searchConfig.columnKey] !== undefined
                ? String(tempFilterValues[searchConfig.columnKey])
                : String(finalFilterValues?.[searchConfig.columnKey] || "")
            }
            onValueChange={(value) => {
              setTempFilterValues((prev) => ({
                ...prev,
                [searchConfig.columnKey]: value,
              }));
            }}
            onSearch={(value) => {
              if (finalSetFilter) {
                finalSetFilter(searchConfig.columnKey, value);
                finalSetFilter("page", "1");
                onSearchChange?.(value);
                setTempFilterValues((prev) => ({
                  ...prev,
                  [searchConfig.columnKey]: value,
                }));
              }
            }}
            isLoading={isLoading}
          />
        </div>
      )}
      {filters.length > 0 && (
        <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              disabled={isLoading}
              aria-label="Open advanced search filters"
              className={`rounded-none !bg-transparent hover:text-foreground cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 flex-shrink-0 ${
                searchConfig?.enabled ? "border-l sm:border-l border-t sm:border-t-0" : ""
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">{triggerText}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[90vw] sm:w-[560px] p-0" align="start">
            <div className="p-4 space-y-6">
              {filters.map((filter) => (
                <div
                  key={filter.key}
                  className="grid grid-cols-1 sm:grid-cols-3 items-start gap-4"
                >
                  <Label className="text-sm text-muted-foreground mt-2">
                    {filter.label}
                  </Label>
                  <div className="sm:col-span-2">
                    {filter.type === "select" ? (
                      <Select
                        value={
                          tempFilterValues?.[filter.key] === ""
                            ? "all"
                            : String(tempFilterValues?.[filter.key] || "all")
                        }
                        onValueChange={(value) =>
                          handleFilterChange(filter.key, value)
                        }
                        disabled={isLoading || filter.disabled}
                      >
                        <SelectTrigger className="w-full" aria-label={`Select ${filter.label}`}>
                          <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : filter.type === "input" ? (
                      <Input
                        type="text"
                        value={String(tempFilterValues?.[filter.key] || "")}
                        onChange={(e) =>
                          handleInputChange(filter.key, e.target.value)
                        }
                        placeholder={
                          filter.placeholder ||
                          `Enter ${filter.label.toLowerCase()}`
                        }
                        disabled={isLoading || filter.disabled}
                        aria-label={`Input for ${filter.label}`}
                        className="w-full"
                      />
                    ) : filter.type === "checkbox" ? (
                      <div className="space-y-2" role="group" aria-label={`Checkbox group for ${filter.label}`}>
                        {filter.options?.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${filter.key}-${option.value}`}
                              checked={
                                Array.isArray(tempFilterValues?.[filter.key])
                                  ? (tempFilterValues[filter.key] as string[]).includes(option.value)
                                  : false
                              }
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  filter.key,
                                  option.value,
                                  checked as boolean
                                )
                              }
                              disabled={isLoading || filter.disabled}
                            />
                            <Label
                              htmlFor={`${filter.key}-${option.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : filter.type === "radio" ? (
                      <div className="space-y-2" role="radiogroup" aria-label={`Radio group for ${filter.label}`}>
                        {filter.options?.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              type="radio"
                              id={`${filter.key}-${option.value}`}
                              name={filter.key}
                              value={option.value}
                              checked={
                                String(tempFilterValues?.[filter.key] || "") === option.value
                              }
                              onChange={(e) =>
                                handleRadioChange(filter.key, e.target.value)
                              }
                              disabled={isLoading || filter.disabled}
                              className="h-4 w-4 text-primary focus:ring-primary border"
                            />
                            <Label
                              htmlFor={`${filter.key}-${option.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="p-4 flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                disabled={isLoading}
                aria-label="Reset all filters"
              >
                Reset
              </Button>
              <Button 
                onClick={handleApply}
                disabled={isLoading}
                aria-label="Apply filters"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
