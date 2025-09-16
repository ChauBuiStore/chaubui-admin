"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      href: "/products",
      icon: PackageIcon,
      color: "bg-blue-500",
    },
    {
      title: "Manage Categories",
      description: "Add or edit categories",
      href: "/categories",
      icon: FolderIcon,
      color: "bg-green-500",
    },
    {
      title: "Manage Colors",
      description: "Add or edit colors",
      href: "/colors",
      icon: PaletteIcon,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Product management system overview
          </p>
        </div>
        <Badge variant="outline" className="text-xs sm:text-sm w-fit">
          <ActivityIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span className="hidden sm:inline">System running normally</span>
          <span className="sm:hidden">Normal</span>
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Products
            </CardTitle>
            <PackageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.growthRate}%</span> from
              last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Categories
            </CardTitle>
            <FolderIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.totalCategories}
            </div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Colors
            </CardTitle>
            <PaletteIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.totalColors}
            </div>
            <p className="text-xs text-muted-foreground">Available colors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Revenue
            </CardTitle>
            <DollarSignIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3 p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 sm:p-3 rounded-lg ${action.color} flex-shrink-0`}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm sm:text-base truncate">
                          {action.title}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm line-clamp-2">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <ActivityIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Latest changes in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 line-clamp-2">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Overview Statistics</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Summary of key metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    Active Users
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  {stats.activeUsers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <ShoppingCartIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    Today&apos;s Orders
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  {stats.totalOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <PackageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    New Products
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium">+12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <TrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    Growth
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-green-600">
                  +{stats.growthRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
