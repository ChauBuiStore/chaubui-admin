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

    if (segments.length === 0) {
      return [{ label: "Home", href: "/", isActive: true }];
    }

    if (segments.length === 1 && segments[0] === "dashboard") {
      return [{ label: "Home", href: "/dashboard", isActive: true }];
    }

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      if (segment === "dashboard") return;

      const labelMap: Record<string, string> = {
        categories: "Categories",
        "categories-group": "Category Groups",
        colors: "Colors",
        products: "Products",
        add: "Add",
        edit: "Edit",
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
