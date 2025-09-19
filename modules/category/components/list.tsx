"use client";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Category } from "../types/categories.type";
import { PaginationMeta } from "@/lib/types";

interface CategoriesListProps {
  categories: Category[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onBulkDelete: (selectedCategories: Category[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
}

export function CategoriesList({
  categories,
  pagination,
  isLoading,
  onEditCategory,
  onDeleteCategory,
  onBulkDelete,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
}: CategoriesListProps) {
  const [selectedRows, setSelectedRows] = useState<Category[]>([]);

  const handleSelectionChange = (selectedCategories: Category[]) => {
    setSelectedRows(selectedCategories);
  };

  const columns: ColumnDef<Category>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row }) => {
          const category = row.original;
          return <span className="font-medium">{category.name}</span>;
        },
      },
      {
        accessorKey: "group",
        header: "Category Group",
        cell: ({ row }) => {
          const category = row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {category.group?.name || "N/A"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const category = row.original;
          return new Date(category.createdAt).toLocaleDateString("en-US");
        },
      },
    ],
    []
  );

  const actionsConfig: ActionsConfig<Category> = useMemo(
    () => ({
      onEdit: (category) => onEditCategory(category),
      onDelete: (category) => onDeleteCategory(category),
    }),
    [onEditCategory, onDeleteCategory]
  );

  return (
    <XTable
      data={categories}
      columns={columns}
      enableSelection={true}
      enableActions={true}
      actionsConfig={actionsConfig}
      onBulkDelete={onBulkDelete}
      onSelectionChange={handleSelectionChange}
      selectedRows={selectedRows}
      loading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      searchConfig={{
        enabled: true,
        columnKey: "keyword",
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
