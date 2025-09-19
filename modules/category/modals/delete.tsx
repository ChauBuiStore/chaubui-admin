"use client";

import { XConfirmDialog } from "@/components/common/x-dialog";
import { Category } from "../types/categories.type";

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  category?: Category | null;
  selectedCategories?: Category[];
}

export function DeleteCategory({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  category,
  selectedCategories = [],
}: DeleteCategoryModalProps) {
  const isBulkDelete = selectedCategories.length > 0;
  const isSingleDelete = category && selectedCategories.length === 0;

  const getTitle = () => {
    if (isBulkDelete) {
      return `Confirm Bulk Delete Categories`;
    }
    return `Confirm Delete Category`;
  };

  const getDescription = () => {
    if (isBulkDelete) {
      const categoryNames = selectedCategories
        .map((cat) => cat.name)
        .join(", ");
      return `Are you sure you want to delete ${selectedCategories.length} categories?\n\nCategories: ${categoryNames}\n\nThis action cannot be undone.`;
    }

    if (isSingleDelete) {
      return `Are you sure you want to delete category "${category?.name}"?\n\nThis action cannot be undone.`;
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
