"use client";

import { Separator } from "@/components/ui";
import { cn } from "@/lib/utils";
import React from "react";

export type XSeparatorProps = React.ComponentProps<typeof Separator>;

export function XSeparator({ className, ...props }: XSeparatorProps) {
  return <Separator className={cn(className)} {...props} />;
}

export default XSeparator;


