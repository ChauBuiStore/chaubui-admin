"use client";

import { XConfirmDialog } from "@/components/common/x-dialog";
import { CategoryGroup } from "../types/categories-group.type";

interface DeleteCategoryGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  categoryGroup?: CategoryGroup | null;
  selectedCategoryGroups?: CategoryGroup[];
}

export function DeleteCategoryGroup({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  categoryGroup,
  selectedCategoryGroups = [],
}: DeleteCategoryGroupModalProps) {
  const isBulkDelete = selectedCategoryGroups.length > 0;
  const isSingleDelete = categoryGroup && selectedCategoryGroups.length === 0;

  const getTitle = () => {
    if (isBulkDelete) {
      return `Confirm Bulk Delete Category Groups`;
    }
    return `Confirm Delete Category Group`;
  };

  const getDescription = () => {
    if (isBulkDelete) {
      const categoryGroupNames = selectedCategoryGroups
        .map((cat) => cat.name)
        .join(", ");
      
      const hasChildren = selectedCategoryGroups.some(
        (cat) => cat.categories && cat.categories.length > 0
      );
      
      return `Are you sure you want to delete ${selectedCategoryGroups.length} category groups?\n\nCategory Groups: ${categoryGroupNames}${
        hasChildren
          ? "\n\n⚠️ Some category groups contain child categories and cannot be deleted."
          : "\n\nThis action cannot be undone."
      }`;
    }

    if (isSingleDelete) {
      const hasChildren = categoryGroup?.categories && categoryGroup.categories.length > 0;
      return `Are you sure you want to delete category group "${categoryGroup?.name}"?${
        hasChildren
          ? "\n\n⚠️ This category group contains child categories and cannot be deleted."
          : "\n\nThis action cannot be undone."
      }`;
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
