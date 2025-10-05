"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { PaginationMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.ultis";

import { Color } from "../types/color.type";

interface ColorsListProps {
  colors: Color[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onEditColor: (color: Color) => void;
  onDeleteColor: (color: Color) => void;
  onBulkDelete: (selectedColors: Color[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
}

export function ColorsList({
  colors,
  pagination,
  isLoading,
  onEditColor,
  onDeleteColor,
  onBulkDelete,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
}: ColorsListProps) {
  const [selectedRows, setSelectedRows] = useState<Color[]>([]);

  const handleSelectionChange = (selectedColors: Color[]) => {
    setSelectedRows(selectedColors);
  };

  const columns: ColumnDef<Color>[] = useMemo(
    () => [
      {
        accessorKey: "nameVi",
        header: "NameVi",
        cell: ({ row }) => {
          const color = row.original;
          return <span className="font-medium">{color.nameVi}</span>;
        },
      },
      {
        accessorKey: "nameEn",
        header: "NameEn",
        cell: ({ row }) => {
          const color = row.original;
          return <span className="font-medium">{color.nameEn}</span>;
        },
      },
      {
        accessorKey: "nameKm",
        header: "NameKm",
        cell: ({ row }) => {
          const color = row.original;
          return <span className="font-medium">{color.nameKm}</span>;
        },
      },
      {
        accessorKey: "code",
        header: "Color Code",
        cell: ({ row }) => {
          const color = row.original;
          return (
            <div
              className="w-6 h-6 rounded-full shadow-md border"
              style={{ backgroundColor: color.code }}
            />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const color = row.original;
          return formatDate(color.createdAt);
        },
      },
    ],
    [],
  );

  const actionsConfig: ActionsConfig<Color> = useMemo(
    () => ({
      onEdit: (color) => onEditColor(color),
      onDelete: (color) => onDeleteColor(color),
    }),
    [onEditColor, onDeleteColor],
  );

  return (
    <XTable
      data={colors}
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
        placeholder: "Search color by name...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
