"use client";

import {
  ActivityIcon,
  DollarSignIcon,
  FolderIcon,
  PackageIcon,
  PaletteIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

import { XBadge, XCard } from "@/components/common";
import { ROUTES } from "@/lib/constants";

export default function DashboardPageRoot() {
  const stats = {
    totalProducts: 1247,
    totalCategories: 23,
    totalColors: 45,
    totalRevenue: 12500000,
    totalOrders: 89,
    totalUsers: 156,
    growthRate: 12.5,
    activeUsers: 89,
  };

  const recentActivities = [
    {
      id: 1,
      type: "product",
      message: "New product 'iPhone 15 Pro' has been added",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "category",
      message: "Category 'Phone' has been updated",
      time: "15 minutes ago",
      status: "info",
    },
    {
      id: 3,
      type: "color",
      message: "New color 'Navy Blue' has been added",
      time: "1 hour ago",
      status: "success",
    },
    {
      id: 4,
      type: "order",
      message: "Order #12345 has been processed",
      time: "2 hours ago",
      status: "warning",
    },
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create new product in the system",
      href: ROUTES.PRODUCT,
      icon: PackageIcon,
      color: "bg-primary",
    },
    {
      title: "Manage Categories",
      description: "Add or edit categories",
      href: ROUTES.CATEGORY,
      icon: FolderIcon,
      color: "bg-primary",
    },
    {
      title: "Manage Colors",
      description: "Add or edit colors",
      href: ROUTES.COLOR,
      icon: PaletteIcon,
      color: "bg-primary",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Management</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Product management system overview
          </p>
        </div>
        <XBadge variant="outline" className="text-xs sm:text-sm w-fit">
          <ActivityIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span className="hidden sm:inline">System running normally</span>
          <span className="sm:hidden">Normal</span>
        </XBadge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <XCard
          title="Total Products"
          action={<PackageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
          titleClassName="text-xs sm:text-sm font-medium"
          wrapperClassName="h-full"
          className="h-full"
        >
          <div className="text-xl sm:text-2xl font-bold">
            {stats.totalProducts.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">+{stats.growthRate}%</span> from last month
          </p>
        </XCard>

        <XCard
          title="Categories"
          action={<FolderIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
          titleClassName="text-xs sm:text-sm font-medium"
          wrapperClassName="h-full"
          className="h-full"
        >
          <div className="text-xl sm:text-2xl font-bold">{stats.totalCategories}</div>
          <p className="text-xs text-muted-foreground">Active categories</p>
        </XCard>

        <XCard
          title="Colors"
          action={<PaletteIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
          titleClassName="text-xs sm:text-sm font-medium"
          wrapperClassName="h-full"
          className="h-full"
        >
          <div className="text-xl sm:text-2xl font-bold">{stats.totalColors}</div>
          <p className="text-xs text-muted-foreground">Available colors</p>
        </XCard>

        <XCard
          title="Revenue"
          action={<DollarSignIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
          titleClassName="text-xs sm:text-sm font-medium"
          wrapperClassName="h-full"
          className="h-full"
        >
          <div className="text-xl sm:text-2xl font-bold">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+8.2%</span> from last month
          </p>
        </XCard>
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <XCard
                  className="hover:shadow-md transition-shadow cursor-pointer h-full"
                  wrapperClassName="h-full"
                  contentClassName="pb-3 p-4 sm:p-6"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 sm:p-3 rounded-lg ${action.color} flex-shrink-0`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm sm:text-base truncate font-semibold">
                        {action.title}
                      </div>
                      <div className="text-xs sm:text-sm line-clamp-2 text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </XCard>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <XCard
          title={
            <div className="flex items-center space-x-2 text-base sm:text-lg">
              <ActivityIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Recent Activity</span>
            </div>
          }
          description="Latest changes in the system"
          headerClassName="p-4 sm:p-6"
          titleClassName="text-base sm:text-lg"
          descriptionClassName="text-xs sm:text-sm"
          contentClassName="p-4 sm:p-6 pt-0"
          wrapperClassName="h-full"
          className="h-full"
        >
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.status === "success"
                      ? "bg-primary"
                      : activity.status === "warning"
                        ? "bg-primary/60"
                        : "bg-primary"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-foreground line-clamp-2">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </XCard>

        <XCard
          title={
            <div className="flex items-center space-x-2 text-base sm:text-lg">
              <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Overview Statistics</span>
            </div>
          }
          description="Summary of key metrics"
          headerClassName="p-4 sm:p-6"
          titleClassName="text-base sm:text-lg"
          descriptionClassName="text-xs sm:text-sm"
          contentClassName="p-4 sm:p-6 pt-0"
          wrapperClassName="h-full"
          className="h-full"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm text-foreground truncate">Active Users</span>
              </div>
              <span className="text-xs sm:text-sm font-medium">{stats.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <ShoppingCartIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm text-foreground truncate">
                  Today&apos;s Orders
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium">{stats.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <PackageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm text-foreground truncate">New Products</span>
              </div>
              <span className="text-xs sm:text-sm font-medium">+12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <TrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 truncate">Growth</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-primary">
                +{stats.growthRate}%
              </span>
            </div>
          </div>
        </XCard>
      </div>
    </div>
  );
}
