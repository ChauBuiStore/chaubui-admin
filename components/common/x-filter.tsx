"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "@/lib/hooks";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterOption {
  key: string;
  label: string;
  value: string;
  type: "select" | "input" | "checkbox" | "radio";
  options?: { value: string; label: string }[];
  placeholder?: string;
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
}

const SearchInput = ({
  searchConfig,
  value,
  onValueChange,
  onSearch,
}: {
  searchConfig: SearchConfig;
  value: string;
  onValueChange: (value: string) => void;
  onSearch?: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(inputValue);
    }
  };

  return (
    <Input
      placeholder={searchConfig.placeholder || "Search..."}
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
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
}: XFilterProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilterValues, setTempFilterValues] = useState<
    Record<string, string | string[]>
  >({});

  const fallbackSearchParams = useSearchParams();
  const finalFilterValues = filterValues || fallbackSearchParams.filters;
  const finalSetFilter = setFilter || fallbackSearchParams.setFilter;
  const finalClearFilters = clearFilters || fallbackSearchParams.clearFilters;

  useEffect(() => {
    if (filterOpen) {
      const cleanFilterValues = Object.entries(finalFilterValues || {})
        .filter(([, value]) => value !== undefined)
        .reduce((acc, [key, value]) => {
          acc[key] = value as string | string[];
          return acc;
        }, {} as Record<string, string | string[]>);
      setTempFilterValues(cleanFilterValues);
    }
  }, [filterOpen, finalFilterValues]);

  const handleFilterChange = (key: string, value: string) => {
    const newValue = value === "all" ? "" : value;
    setTempFilterValues((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleInputChange = (key: string, value: string) => {
    setTempFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (
    key: string,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (tempFilterValues?.[key] as string[]) || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    setTempFilterValues((prev) => ({ ...prev, [key]: newValues }));
  };

  const handleRadioChange = (key: string, value: string) => {
    setTempFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    Object.entries(tempFilterValues).forEach(([key, value]) => {
      finalSetFilter(key, value);
    });

    finalSetFilter("page", "1");

    onApply?.(tempFilterValues);
    setFilterOpen(false);
  };

  const handleReset = () => {
    setTempFilterValues({});
    finalClearFilters();
    finalSetFilter("page", "1");
    onReset?.();
    setFilterOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center border border-1 border-gray-200 rounded-full p-1 gap-2 sm:gap-0">
      {searchConfig?.enabled && (
        <div className="flex-1 min-w-0">
          <SearchInput
            searchConfig={searchConfig}
            value={
              tempFilterValues?.[searchConfig.columnKey] !== undefined
                ? (tempFilterValues[searchConfig.columnKey] as string)
                : (finalFilterValues?.[searchConfig.columnKey] as string) || ""
            }
            onValueChange={(value) => {
              setTempFilterValues((prev) => ({
                ...prev,
                [searchConfig.columnKey]: value,
              }));
            }}
            onSearch={(value) => {
              finalSetFilter(searchConfig.columnKey, value);
              finalSetFilter("page", "1"); // Reset to page 1 when searching
              onSearchChange?.(value);
              // Update tempFilterValues to match the search result
              setTempFilterValues((prev) => ({
                ...prev,
                [searchConfig.columnKey]: value,
              }));
            }}
          />
        </div>
      )}
      {filters.length > 0 && (
        <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`rounded-none !bg-transparent hover:text-gray-500 cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 flex-shrink-0 ${
                searchConfig?.enabled
                  ? "border-l-1 border-gray-200 sm:border-l-1 sm:border-t-0 border-t-1"
                  : ""
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">{triggerText}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[90vw] sm:w-[560px] p-0"
            align="start"
          >
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
                            : (tempFilterValues?.[filter.key] as string) ||
                              "all"
                        }
                        onValueChange={(value) =>
                          handleFilterChange(filter.key, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={`Select ${filter.label.toLowerCase()}`}
                          />
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
                        value={(tempFilterValues?.[filter.key] as string) || ""}
                        onChange={(e) =>
                          handleInputChange(filter.key, e.target.value)
                        }
                        placeholder={
                          filter.placeholder ||
                          `Enter ${filter.label.toLowerCase()}`
                        }
                        className="w-full"
                      />
                    ) : filter.type === "checkbox" ? (
                      <div className="space-y-2">
                        {filter.options?.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${filter.key}-${option.value}`}
                              checked={(
                                (tempFilterValues?.[filter.key] as string[]) ||
                                []
                              ).includes(option.value)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  filter.key,
                                  option.value,
                                  checked as boolean
                                )
                              }
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
                      <div className="space-y-2">
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
                                (tempFilterValues?.[filter.key] as string) ===
                                option.value
                              }
                              onChange={(e) =>
                                handleRadioChange(filter.key, e.target.value)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleApply}>Search</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
