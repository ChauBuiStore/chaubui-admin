"use client";

import { XDialog } from "@/components/common/x-dialog";
import { Button } from "@/components/ui/button";
import { Product } from "../types/product.type";

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
    } catch {
    }
  };

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isBulkDelete ? "Delete Multiple Products" : "Delete Product"}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          {isBulkDelete
            ? `Are you sure you want to delete ${count} selected products?`
            : `Are you sure you want to delete product "${product?.name}"?`}
        </p>
        
        {isBulkDelete && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Products to be deleted:</p>
            <ul className="text-sm space-y-1">
              {selectedProducts.slice(0, 5).map((product) => (
                <li key={product.id} className="text-gray-700">
                  • {product.name}
                </li>
              ))}
              {selectedProducts.length > 5 && (
                <li className="text-gray-500">
                  ... and {selectedProducts.length - 5} other products
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </XDialog>
  );
}
