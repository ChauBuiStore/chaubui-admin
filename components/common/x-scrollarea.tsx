"use client";

import { ScrollArea, ScrollBar } from "@/components/ui";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface XScrollAreaProps
  extends React.ComponentProps<typeof ScrollArea> {
  orientation?: "vertical" | "horizontal" | "both";
  showScrollbar?: boolean;
  scrollbarClassName?: string;
  wrapperClassName?: string;
}

export const XScrollArea = forwardRef<
  React.ComponentRef<typeof ScrollArea>,
  XScrollAreaProps
>(
  (
    {
      orientation = "vertical",
      showScrollbar = true,
      scrollbarClassName,
      wrapperClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", wrapperClassName)}>
        <ScrollArea
          ref={ref}
          className={cn("relative", className)}
          {...props}
        >
          {children}
          {showScrollbar && (
            <>
              {(orientation === "vertical" || orientation === "both") && (
                <ScrollBar
                  orientation="vertical"
                  className={cn(scrollbarClassName)}
                />
              )}
              {(orientation === "horizontal" || orientation === "both") && (
                <ScrollBar
                  orientation="horizontal"
                  className={cn(scrollbarClassName)}
                />
              )}
            </>
          )}
        </ScrollArea>
      </div>
    );
  }
);

XScrollArea.displayName = "XScrollArea";

export default XScrollArea;
