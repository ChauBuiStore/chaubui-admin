"use client";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { ColumnDef } from "@tanstack/react-table";
import { FolderIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryGroup } from "../types/categories-group.type";
import { PaginationMeta } from "@/lib/types/pagination";

interface CategoriesListProps {
  categoriesGroup: CategoryGroup[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onEditCategory: (category: CategoryGroup) => void;
  onDeleteCategory: (category: CategoryGroup) => void;
  onBulkDelete: (selectedCategories: CategoryGroup[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
}

export function CategoriesGroupList({
  categoriesGroup,
  pagination,
  isLoading,
  onEditCategory,
  onDeleteCategory,
  onBulkDelete,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
}: CategoriesListProps) {
  const [selectedRows, setSelectedRows] = useState<CategoryGroup[]>([]);

  const handleSelectionChange = (selectedCategories: CategoryGroup[]) => {
    setSelectedRows(selectedCategories);
  };

  const columns: ColumnDef<CategoryGroup>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row }) => {
          const categoryGroup = row.original;
          return (
            <div className="flex items-center gap-2 min-w-0">
              <FolderIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">{categoryGroup.name}</span>
                <span className="text-xs text-muted-foreground truncate sm:hidden">
                  {categoryGroup.slug}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => {
          const categoryGroup = row.original;
          return (
            <span className="font-medium hidden sm:inline-block">
              {categoryGroup.slug}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const categoryGroup = row.original;
          return (
            <span className="hidden md:inline-block">
              {new Date(categoryGroup.createdAt).toLocaleDateString('en-US')}
            </span>
          );
        },
      },
    ],
    []
  );

  const actionsConfig: ActionsConfig<CategoryGroup> = useMemo(
    () => ({
      onEdit: (category) => onEditCategory(category),
      customActions: [
        {
          label: "Delete",
          onClick: (category) => onDeleteCategory(category),
          variant: "destructive" as const,
          disabled: (category) => Boolean(category.categories && category.categories.length > 0),
        },
      ],
    }),
    [onEditCategory, onDeleteCategory]
  );

  return (
    <XTable
      data={categoriesGroup}
      columns={columns}
      enableSelection={true}
      enableActions={true}
      actionsConfig={actionsConfig}
      onBulkDelete={onBulkDelete}
      selectedRows={selectedRows}
      onSelectionChange={handleSelectionChange}
      loading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      searchConfig={{
        enabled: true,
        columnKey: "search",
        placeholder: "Search categories...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
