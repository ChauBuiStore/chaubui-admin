"use client";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui";
import { useAuth, useToast } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderTreeIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  PaletteIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children?: SidebarSubItem[];
}

interface SidebarSubItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    description: "Main Dashboard",
  },
  {
    title: "Manages Menus",
    href: "/menu",
    icon: MenuIcon,
    description: "Manages menu list",
  },
  {
    title: "Manages Colors",
    href: "/colors",
    icon: PaletteIcon,
    description: "Manages color list",
  },
  {
    title: "Manages Categories",
    href: "#",
    icon: FolderIcon,
    description: "Manages product categories",
    children: [
      {
        title: "Category Groups",
        href: "/categories-group",
        icon: FolderOpenIcon,
      },
      {
        title: "Categories",
        href: "/categories",
        icon: FolderTreeIcon,
      },
    ],
  },
  {
    title: "Manages Products",
    href: "/products",
    icon: PackageIcon,
    description: "Manages product list",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  const { toast } = useToast();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [manuallyCollapsed, setManuallyCollapsed] = useState<string[]>([]);

  const getExpandedItems = () => {
    const autoExpanded = sidebarItems
      .filter(
        (item) =>
          item.children &&
          item.children.some((child) => pathname === child.href)
      )
      .map((item) => item.href);

    const filteredAutoExpanded = autoExpanded.filter(
      (item) => !manuallyCollapsed.includes(item)
    );

    return [...new Set([...expandedItems, ...filteredAutoExpanded])];
  };

  const toggleExpanded = (itemHref: string) => {
    const isCurrentlyExpanded = getExpandedItems().includes(itemHref);

    if (isCurrentlyExpanded) {
      setExpandedItems((prev) => prev.filter((href) => href !== itemHref));
      setManuallyCollapsed((prev) => [...prev, itemHref]);
    } else {
      setExpandedItems((prev) => [...prev, itemHref]);
      setManuallyCollapsed((prev) => prev.filter((href) => href !== itemHref));
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result) {
        toast("Logout successful", { type: "success" });
        router.push("/login");
      } else {
        toast("An error occurred during logout", {
          type: "error",
        });
      }
    } catch {
      toast("An error occurred, please try again later", { type: "error" });
    }
  };

  return (
    <SidebarComponent
      className={cn(
        "bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 shadow-xl",
        className
      )}
    >
      <SidebarHeader className="border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3 px-4 py-1.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
            <HomeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Châu Bùi Store</h2>
            <p className="text-xs text-white/80">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                const hasActiveChild =
                  item.children &&
                  item.children.some((child) => pathname === child.href);
                const isExpanded = getExpandedItems().includes(item.href);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    {item.children ? (
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "h-12 px-3 rounded-lg transition-all duration-200 group cursor-pointer",
                          isActive
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : hasActiveChild
                            ? "bg-slate-50 text-slate-600"
                            : "hover:bg-slate-50 text-slate-700"
                        )}
                        onClick={() => toggleExpanded(item.href)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              isActive
                                ? "text-blue-600"
                                : hasActiveChild
                                ? "text-slate-600"
                                : "text-slate-600 group-hover:text-slate-800"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium transition-colors duration-200",
                              isActive
                                ? "text-blue-700"
                                : hasActiveChild
                                ? "text-slate-600"
                                : "text-slate-700 group-hover:text-slate-900"
                            )}
                          >
                            {item.title}
                          </span>
                          <ChevronRightIcon
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform duration-200",
                              isExpanded
                                ? "text-slate-600 rotate-90"
                                : "text-slate-500"
                            )}
                          />
                        </div>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "h-12 px-3 rounded-lg transition-all duration-200 group",
                          isActive
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              isActive
                                ? "text-blue-600"
                                : "text-slate-600 group-hover:text-slate-800"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium transition-colors duration-200",
                              isActive
                                ? "text-blue-700"
                                : "text-slate-700 group-hover:text-slate-900"
                            )}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    )}

                    {item.children && isExpanded && (
                      <SidebarMenuSub className="ml-2 mt-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          const ChildIcon = child.icon;

                          return (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isChildActive}
                                className={cn(
                                  "h-10 px-3 rounded-md transition-all duration-200 group",
                                  isChildActive
                                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                                    : "hover:bg-slate-50 text-slate-600"
                                )}
                              >
                                <Link
                                  href={child.href}
                                  className="flex items-center gap-3"
                                >
                                  <ChildIcon
                                    className={cn(
                                      "h-4 w-4 transition-colors duration-200",
                                      isChildActive
                                        ? "text-blue-500"
                                        : "text-slate-500 group-hover:text-slate-700"
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "text-sm font-medium transition-colors duration-200",
                                      isChildActive
                                        ? "text-blue-600"
                                        : "text-slate-600 group-hover:text-slate-800"
                                    )}
                                  >
                                    {child.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/60 px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoading}
              className="h-12 px-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 group cursor-pointer"
              tooltip="Logout"
            >
              <LogOutIcon className="h-5 w-5 group-hover:scale-105 transition-transform duration-200" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
}
