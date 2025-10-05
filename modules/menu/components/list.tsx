"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { ActionsConfig, XTable } from "@/components/common";
import { PaginationMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.ultis";

import { Menu } from "../types";

interface MenusListProps {
  menus: Menu[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (menu: Menu) => void;
  onBulkDelete: (selectedMenus: Menu[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
}

export function MenusList({
  menus,
  pagination,
  isLoading,
  onEditMenu,
  onDeleteMenu,
  onBulkDelete,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
}: MenusListProps) {
  const [selectedRows, setSelectedRows] = useState<Menu[]>([]);

  const handleSelectionChange = (selectedMenus: Menu[]) => {
    setSelectedRows(selectedMenus);
  };

  const columns: ColumnDef<Menu>[] = useMemo(
    () => [
      {
        accessorKey: "nameVi",
        header: "NameVi",
        cell: ({ row }) => {
          const menu = row.original;
          return <span className="font-medium">{menu.nameVi}</span>;
        },
      },
      {
        accessorKey: "nameEn",
        header: "NameEn",
        cell: ({ row }) => {
          const menu = row.original;
          return <span className="font-medium">{menu.nameEn}</span>;
        },
      },
      {
        accessorKey: "nameKm",
        header: "NameKm",
        cell: ({ row }) => {
          const menu = row.original;
          return <span className="font-medium">{menu.nameKm}</span>;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const menu = row.original;
          return formatDate(menu.createdAt);
        },
      },
    ],
    [],
  );

  const actionsConfig: ActionsConfig<Menu> = useMemo(
    () => ({
      onEdit: (menu) => onEditMenu(menu),
      onDelete: (menu) => onDeleteMenu(menu),
    }),
    [onEditMenu, onDeleteMenu],
  );

  return (
    <XTable
      data={menus}
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
        placeholder: "Search menu by name...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
