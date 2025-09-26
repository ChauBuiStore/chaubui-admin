"use client";

import { XButton, XDropdownMenu } from "@/components/common";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";
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
                    <XDropdownMenu
                      align="start"
                      trigger={
                        <XButton className="flex h-9 w-9 items-center justify-center">
                          <BreadcrumbEllipsis className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </XButton>
                      }
                    >
                      {breadcrumbs.slice(1, -1).map((item) => (
                        <button
                          key={item.href || item.label}
                          className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          {item.href ? (
                            <Link href={item.href} className="flex w-full">
                              {item.label}
                            </Link>
                          ) : (
                            item.label
                          )}
                        </button>
                      ))}
                    </XDropdownMenu>
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
