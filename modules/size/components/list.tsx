"use client";

import { ActionsConfig, XTable } from "@/components/common";
import { PaginationMeta } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Size } from "../types";

interface SizesListProps {
  sizes: Size[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onEditSize: (size: Size) => void;
  onDeleteSize: (size: Size) => void;
  onBulkDelete: (selectedSizes: Size[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
}

export function SizesList({
  sizes,
  pagination,
  isLoading,
  onEditSize,
  onDeleteSize,
  onBulkDelete,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
}: SizesListProps) {
  const [selectedRows, setSelectedRows] = useState<Size[]>([]);

  const handleSelectionChange = (selectedSizes: Size[]) => {
    setSelectedRows(selectedSizes);
  };

  const columns: ColumnDef<Size>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const size = row.original;
          return <span className="font-medium">{size.name}</span>;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const size = row.original;
          return new Date(size.createdAt).toLocaleDateString("en-US");
        },
      },
    ],
    []
  );

  const actionsConfig: ActionsConfig<Size> = useMemo(
    () => ({
      onEdit: (size) => onEditSize(size),
      onDelete: (size) => onDeleteSize(size),
    }),
    [onEditSize, onDeleteSize]
  );

  return (
    <XTable
      data={sizes}
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
        placeholder: "Search size...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
