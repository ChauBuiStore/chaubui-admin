"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef, ReactNode } from "react";

export interface XDropdownMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export interface XDropdownMenuProps {
  trigger: ReactNode;
  children?: ReactNode;
  items?: XDropdownMenuItem[];
  label?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
  contentClassName?: string;
  showChevron?: boolean;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const XDropdownMenu = forwardRef<HTMLDivElement, XDropdownMenuProps>(
  (
    {
      trigger,
      children,
      items = [],
      label,
      align = "end",
      side = "bottom",
      sideOffset = 4,
      className,
      contentClassName,
      showChevron = true,
      disabled = false,
      open,
      onOpenChange,
    },
    ref
  ) => {
    const handleItemClick = (item: XDropdownMenuItem) => {
      if (item.disabled) return;
      if (item.href) {
        window.location.href = item.href;
      } else if (item.onClick) {
        item.onClick();
      }
    };

    return (
      <div ref={ref} className={cn("relative", className)}>
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <div className="flex items-center gap-2 cursor-pointer">
              {trigger}
              {showChevron && <ChevronDown className="h-4 w-4 opacity-50" />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={align}
            side={side}
            sideOffset={sideOffset}
            className={cn("w-56", contentClassName)}
          >
            {label && (
              <>
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            {children
              ? children
              : items.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      item.className
                    )}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0">{item.icon}</span>
                    )}
                    <span className="flex-1">{item.label}</span>
                  </DropdownMenuItem>
                ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

XDropdownMenu.displayName = "XDropdownMenu";

export default XDropdownMenu;
