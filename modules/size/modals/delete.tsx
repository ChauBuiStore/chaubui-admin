"use client";

import { XConfirmDialog } from "@/components/common";
import { Size } from "../types";

interface DeleteSizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  size?: Size | null;
  selectedSizes?: Size[];
}

export function DeleteSize({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  size,
  selectedSizes = [],
}: DeleteSizeModalProps) {
  const isBulkDelete = selectedSizes.length > 0;
  const isSingleDelete = size && selectedSizes.length === 0;

  const getTitle = () => {
    if (isBulkDelete) {
      return `Confirm Bulk Delete Sizes`;
    }
    return `Confirm Delete Size`;
  };

  const getDescription = () => {
    if (isBulkDelete) {
      const sizeNames = selectedSizes
        .map((size) => size.name)
        .join(", ");
      return `Are you sure you want to delete ${selectedSizes.length} sizes?\n\nSizes: ${sizeNames}\n\nThis action cannot be undone.`;
    }

    if (isSingleDelete) {
      return `Are you sure you want to delete size "${size?.name}"?\n\nThis action cannot be undone.`;
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
