"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBreadcrumb } from "@/lib/hooks";
import Link from "next/link";
import React from "react";

export function XBreadcrumb() {
  const breadcrumbs = useBreadcrumb();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <BreadcrumbItem key={breadcrumb.href || breadcrumb.label}>
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          if (
            breadcrumbs.length > 4 &&
            index > 0 &&
            index < breadcrumbs.length - 2
          ) {
            if (index === 1) {
              return (
                <React.Fragment key="ellipsis-group">
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center">
                        <BreadcrumbEllipsis className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {breadcrumbs.slice(1, -1).map((item) => (
                          <DropdownMenuItem key={item.href || item.label}>
                            {item.href ? (
                              <Link href={item.href} className="flex w-full">
                                {item.label}
                              </Link>
                            ) : (
                              item.label
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              );
            }
            return null;
          }

          return (
            <React.Fragment
              key={`${breadcrumb.href || breadcrumb.label}-group`}
            >
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.href!}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
