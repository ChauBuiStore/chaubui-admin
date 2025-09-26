"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui";
import { useDebounce } from "@/lib/hooks";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface XCommandItemConfig {
  label: string;
  shortcut?: string;
  onSelect?: () => void;
}

export interface XCommandGroupConfig {
  heading?: string;
  items: XCommandItemConfig[];
}

export interface XCommandProps {
  placeholder?: string;
  emptyText?: string;
  groups: XCommandGroupConfig[];
  className?: string;
  variant?: "inline" | "dialog";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  dialogClassName?: string;
  showCloseButton?: boolean;
  onLoadMore?: () => void;
  hasMoreData?: boolean;
  loading?: boolean;
  loadThreshold?: number;
  onSearchChange?: (searchTerm: string) => void;
  searchValue?: string;
  debounceMs?: number;
  disableClientFilter?: boolean;
}

export function XCommand({
  placeholder = "Tìm...",
  emptyText = "Không có kết quả",
  groups,
  className,
  variant = "inline",
  open,
  onOpenChange,
  title = "Command Palette",
  description = "Search or run a command",
  dialogClassName,
  showCloseButton = true,
  onLoadMore,
  hasMoreData = false,
  loading = false,
  loadThreshold = 50,
  onSearchChange,
  searchValue = "",
  debounceMs = 300,
  disableClientFilter = false,
}: XCommandProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [internalSearchValue, setInternalSearchValue] = useState(searchValue);

  const handleLoadMore = useCallback(() => {
    if (hasMoreData && !loading) onLoadMore?.();
  }, [hasMoreData, loading, onLoadMore]);

  useDebounce(internalSearchValue, debounceMs || 300, onSearchChange);

  const handleSearchChange = useCallback((value: string) => {
    setInternalSearchValue(value);
  }, []);

  useEffect(() => {
    setInternalSearchValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const nearBottom =
        scrollTop + clientHeight >= scrollHeight - loadThreshold;
      if (nearBottom && hasMoreData && !loading) handleLoadMore();
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMoreData, loading, loadThreshold, handleLoadMore]);

  const Content = (
    <Command className={className} shouldFilter={!disableClientFilter}>
      <CommandInput
        placeholder={placeholder}
        value={internalSearchValue}
        onValueChange={handleSearchChange}
      />
      <CommandList ref={listRef} className="max-h-[300px] overflow-y-auto">
        <CommandEmpty>{emptyText}</CommandEmpty>
        {groups.map((group, gi) => (
          <CommandGroup key={gi} heading={group.heading}>
            {group.items.map((item, ii) => (
              <CommandItem key={ii} onSelect={item.onSelect}>
                {item.label}
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        {groups.length > 1 &&
          groups.map((_, gi) =>
            gi < groups.length - 1 ? (
              <CommandSeparator key={`sep-${gi}`} />
            ) : null
          )}
        {loading && (
          <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}
      </CommandList>
    </Command>
  );

  if (variant === "dialog") {
    return (
      <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        className={dialogClassName}
        showCloseButton={showCloseButton}
      >
        {Content}
      </CommandDialog>
    );
  }

  return Content;
}

export default XCommand;
