"use client";

import React from "react";

import { Separator } from "@/components/ui";
import { cn } from "@/lib/utils";

export type XSeparatorProps = React.ComponentProps<typeof Separator>;

export function XSeparator({ className, ...props }: XSeparatorProps) {
  return <Separator className={cn(className)} {...props} />;
}

export default XSeparator;
