"use client";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export const XBadge = forwardRef<React.ComponentRef<typeof Badge>, React.ComponentProps<typeof Badge>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Badge ref={ref} className={cn("inline-flex items-center gap-1", className)} {...props}>
        {children}
      </Badge>
    );
  }
);

XBadge.displayName = "XBadge";

export default XBadge;


