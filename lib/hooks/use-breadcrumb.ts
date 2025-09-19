"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      const labelMap: Record<string, string> = {
        dashboard: "Dashboard Management",
        categories: "Category Management",
        "categories-group": "Category Group Management",
        colors: "Color Management",
        menu: "Menu Management",
        sizes: "Size Management",
        products: "Product Management",
      };

      const label =
        labelMap[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          segment
        ) ||
        /^\d+$/.test(segment)
      ) {
        return;
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        isActive: isLast,
      });
    });

    return breadcrumbs;
  }, [pathname]);
}
