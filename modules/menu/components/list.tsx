"use client";

import { ActionsConfig, XTable } from "@/components/common";
import { PaginationMeta } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
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
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const menu = row.original;
          return <span className="font-medium">{menu.name}</span>;
        },
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => {
          const menu = row.original;
          return <span className="font-medium">{menu.slug}</span>;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const menu = row.original;
          return new Date(menu.createdAt).toLocaleDateString("en-US");
        },
      },
    ],
    []
  );

  const actionsConfig: ActionsConfig<Menu> = useMemo(
    () => ({
      onEdit: (menu) => onEditMenu(menu),
      onDelete: (menu) => onDeleteMenu(menu),
    }),
    [onEditMenu, onDeleteMenu]
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
        columnKey: "keyword",
        placeholder: "Search menu...",
      }}
      filterConfig={{
        enabled: false,
        filters: [],
      }}
      onSearchChange={onSearchChange}
    />
  );
}
