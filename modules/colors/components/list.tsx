"use client";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { PaginationMeta } from "@/lib/types";
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
        accessorKey: "name",
        header: "Color Name",
        cell: ({ row }) => {
          const color = row.original;
          return <span className="font-medium">{color.name}</span>;
        },
      },
      {
        accessorKey: "code",
        header: "Color Code",
        cell: ({ row }) => {
          const color = row.original;
          return (
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: color.code }}
              />
              <span className="font-medium">{color.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const color = row.original;
          return new Date(color.createdAt).toLocaleDateString("en-US");
        },
      },
    ],
    []
  );

  const actionsConfig: ActionsConfig<Color> = useMemo(
    () => ({
      onEdit: (color) => onEditColor(color),
      onDelete: (color) => onDeleteColor(color),
    }),
    [onEditColor, onDeleteColor]
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
        placeholder: "Search Colors...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
