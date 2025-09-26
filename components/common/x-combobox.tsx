"use client";

import { XButton, XCommand, XPopover } from "@/components/common";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface XComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
  onLoadMore?: () => void;
  hasMoreData?: boolean;
  loading?: boolean;
  loadThreshold?: number;
  onSearchChange?: (searchTerm: string) => void;
  searchValue?: string;
  debounceMs?: number;
  disableClientFilter?: boolean;
}

export function XCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  disabled = false,
  hasError = false,
  onLoadMore,
  hasMoreData = false,
  loading = false,
  loadThreshold = 50,
  onSearchChange,
  searchValue = "",
  debounceMs = 300,
  disableClientFilter = false,
}: XComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? "";
  }, [options, value]);

  return (
    <XPopover
      open={open}
      onOpenChange={setOpen}
      contentClassName="p-0"
      matchTriggerWidth
      trigger={
        <XButton
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            hasError && "border-destructive",
            className
          )}
          disabled={disabled}
        >
          <span className={cn(!selectedLabel && "text-muted-foreground")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </XButton>
      }
      size="md"
      align="start"
    >
      <XCommand
        placeholder={searchPlaceholder}
        emptyText={emptyText}
        onLoadMore={onLoadMore}
        hasMoreData={hasMoreData}
        loading={loading}
        loadThreshold={loadThreshold}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        debounceMs={debounceMs}
        disableClientFilter={disableClientFilter}
        groups={[{
          items: options.map((option) => ({
            label: option.label,
            value: option.value,
            onSelect: () => {
              onValueChange?.(option.value);
              setOpen(false);
            },
          })),
        }]}
      />
    </XPopover>
  );
}

export default XCombobox;
