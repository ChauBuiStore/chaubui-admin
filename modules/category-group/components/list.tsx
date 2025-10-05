"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { PaginationMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.ultis";

import { CategoryGroup } from "../types/categories-group.type";

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
        accessorKey: "nameVi",
        header: "NameVi",
        cell: ({ row }) => {
          const categoryGroup = row.original;
          return <span className="font-medium truncate">{categoryGroup.nameVi}</span>;
        },
      },
      {
        accessorKey: "nameEn",
        header: "NameEn",
        cell: ({ row }) => {
          const categoryGroup = row.original;
          return <span className="font-medium truncate">{categoryGroup.nameEn}</span>;
        },
      },
      {
        accessorKey: "nameKm",
        header: "NameKm",
        cell: ({ row }) => {
          const categoryGroup = row.original;
          return <span className="font-medium truncate">{categoryGroup.nameKm}</span>;
        },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => {
          const categoryGroup = row.original;
          return <span className="font-medium">{categoryGroup.slug}</span>;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const categoryGroup = row.original;
          return <span className="font-medium">{formatDate(categoryGroup.createdAt)}</span>;
        },
      },
    ],
    [],
  );

  const actionsConfig: ActionsConfig<CategoryGroup> = useMemo(
    () => ({
      onEdit: (category) => onEditCategory(category),
      customActions: [
        {
          label: "Delete",
          onClick: (category) => onDeleteCategory(category),
          disabled: (category) => Boolean(category.categories && category.categories.length > 0),
        },
      ],
    }),
    [onEditCategory, onDeleteCategory],
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
        columnKey: "keyword",
        placeholder: "Search category group by name...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
