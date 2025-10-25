"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { ActionsConfig, XTable } from "@/components/common";
import { PaginationMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.ultis";

import { Size } from "../types/size.type";

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

  const columns: ColumnDef<Size>[] = [
    {
      accessorKey: "nameVi",
      header: "NameVi",
      cell: ({ row }) => {
        const size = row.original;
        return <span className="font-medium">{size.nameVi}</span>;
      },
    },
    {
      accessorKey: "nameEn",
      header: "NameEn",
      cell: ({ row }) => {
        const size = row.original;
        return <span className="font-medium">{size.nameEn}</span>;
      },
    },
    {
      accessorKey: "nameKm",
      header: "NameKm",
      cell: ({ row }) => {
        const size = row.original;
        return <span className="font-medium">{size.nameKm}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => {
        const size = row.original;
        return formatDate(size.createdAt);
      },
    },
  ];

  const actionsConfig: ActionsConfig<Size> = {
    onEdit: (size) => onEditSize(size),
    onDelete: (size) => onDeleteSize(size),
  };

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
        columnKey: "search",
        placeholder: "Search size by name...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
