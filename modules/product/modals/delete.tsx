"use client";

import { XConfirmDialog } from "@/components/common";

import { Product } from "../types";

interface DeleteProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
  product?: Product | null;
  selectedProducts?: Product[];
}

export function DeleteProduct({
  open,
  onOpenChange,
  onConfirm,
  loading,
  product,
  selectedProducts = [],
}: DeleteProductProps) {
  const isBulkDelete = selectedProducts.length > 0;
  const count = isBulkDelete ? selectedProducts.length : 1;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {}
  };

  const description = isBulkDelete ? (
    <div className="space-y-2">
      <p>Are you sure you want to delete {count} selected products?</p>
      <div className="bg-muted p-3 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Products to be deleted:</p>
        <ul className="text-sm space-y-1">
          {selectedProducts.slice(0, 5).map((p) => (
            <li key={p.id} className="text-foreground">
              • {p.nameEn}
            </li>
          ))}
          {selectedProducts.length > 5 && (
            <li className="text-muted-foreground">
              ... and {selectedProducts.length - 5} other products
            </li>
          )}
        </ul>
      </div>
    </div>
  ) : (
    `Are you sure you want to delete product "${product?.nameEn}"?`
  );

  return (
    <XConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isBulkDelete ? "Delete Multiple Products" : "Delete Product"}
      description={description}
      onConfirm={handleConfirm}
      onCancel={() => onOpenChange(false)}
      confirmText={loading ? "Deleting..." : "Delete"}
      confirmVariant="destructive"
      loading={loading}
    />
  );
}
