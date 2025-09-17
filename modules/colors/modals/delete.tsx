"use client";

import { XConfirmDialog } from "@/components/common/x-dialog";
import { Color } from "../types/color.type";

interface DeleteColorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  color?: Color | null;
  selectedColors?: Color[];
}

export function DeleteColor({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  color,
  selectedColors = [],
}: DeleteColorModalProps) {
  const isBulkDelete = selectedColors.length > 0;
  const isSingleDelete = color && selectedColors.length === 0;

  const getTitle = () => {
    if (isBulkDelete) {
      return `Confirm Bulk Delete Colors`;
    }
    return `Confirm Delete Color`;
  };

  const getDescription = () => {
    if (isBulkDelete) {
      const colorNames = selectedColors
        .map((color) => color.name)
        .join(", ");
      return `Are you sure you want to delete ${selectedColors.length} colors?\n\nColors: ${colorNames}\n\nThis action cannot be undone.`;
    }

    if (isSingleDelete) {
      return `Are you sure you want to delete color "${color?.name}"?\n\nThis action cannot be undone.`;
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
