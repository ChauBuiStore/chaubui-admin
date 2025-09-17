"use client";

import { XConfirmDialog } from "@/components/common";
import { Menu } from "../types";

interface DeleteMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  menu?: Menu | null;
  selectedMenus?: Menu[];
}

export function DeleteMenu({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  menu,
  selectedMenus = [],
}: DeleteMenuModalProps) {
  const isBulkDelete = selectedMenus.length > 0;
  const isSingleDelete = menu && selectedMenus.length === 0;

  const getTitle = () => {
    if (isBulkDelete) {
      return `Confirm Bulk Delete Menus`;
    }
    return `Confirm Delete Menu`;
  };

  const getDescription = () => {
    if (isBulkDelete) {
      const menuNames = selectedMenus
        .map((menu) => menu.name)
        .join(", ");
      return `Are you sure you want to delete ${selectedMenus.length} menus?\n\nMenus: ${menuNames}\n\nThis action cannot be undone.`;
    }

    if (isSingleDelete) {
      return `Are you sure you want to delete menu "${menu?.name}"?\n\nThis action cannot be undone.`;
    }

    return "Are you sure you want to delete the selected items?";
  };

  const getConfirmText = () => {
    if (isBulkDelete) {
      return "Delete All";
    }
    return "Delete";
  };

  return (
    <XConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      description={getDescription()}
      onConfirm={onConfirm}
      onCancel={() => onOpenChange(false)}
      confirmText={getConfirmText()}
      cancelText="Cancel"
      confirmVariant="destructive"
      variant="warning"
      loading={loading}
    />
  );
}
