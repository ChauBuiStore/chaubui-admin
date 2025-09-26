"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import React from "react";

export interface XPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  size?: "sm" | "md" | "lg";
  contentClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
  closeOnClickOutside?: boolean;
  matchTriggerWidth?: boolean;
}

export function XPopover({
  trigger,
  children,
  open,
  onOpenChange,
  align = "start",
  size = "md",
  contentClassName,
  triggerClassName,
  disabled = false,
  closeOnClickOutside = true,
  matchTriggerWidth = false,
}: XPopoverProps) {
  const sizeClass = matchTriggerWidth
    ? "w-[var(--radix-popover-trigger-width)]"
    : size === "sm"
      ? "w-56"
      : size === "lg"
        ? "w-96"
        : "w-80";

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild disabled={disabled} className={triggerClassName}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-4", sizeClass, contentClassName)}
        align={align}
        onInteractOutside={
          closeOnClickOutside ? undefined : (e) => e.preventDefault()
        }
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default XPopover;
