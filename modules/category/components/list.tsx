"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { PaginationMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.ultis";

import { Category } from "../types/categories.type";

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
        accessorKey: "nameVi",
        header: "NameVi",
        cell: ({ row }) => {
          const category = row.original;
          return <span className="font-medium">{category.nameVi}</span>;
        },
      },
      {
        accessorKey: "nameEn",
        header: "NameEn",
        cell: ({ row }) => {
          const category = row.original;
          return <span className="font-medium">{category.nameEn}</span>;
        },
      },
      {
        accessorKey: "nameKm",
        header: "NameKm",
        cell: ({ row }) => {
          const category = row.original;
          return <span className="font-medium">{category.nameKm}</span>;
        },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => {
          const category = row.original;
          return <span className="font-medium">{category.slug}</span>;
        },
      },
      {
        accessorKey: "group",
        header: "Category Group",
        cell: ({ row }) => {
          const category = row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                {category.group?.nameVi || "N/A"}
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                {category.group?.nameEn || "N/A"}
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                {category.group?.nameKm || "N/A"}
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
          return formatDate(category.createdAt);
        },
      },
    ],
    [],
  );

  const actionsConfig: ActionsConfig<Category> = useMemo(
    () => ({
      onEdit: (category) => onEditCategory(category),
      onDelete: (category) => onDeleteCategory(category),
    }),
    [onEditCategory, onDeleteCategory],
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
        columnKey: "search",
        placeholder: "Search category by name...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
