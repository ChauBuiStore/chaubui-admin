"use client";

import { Button } from "@/components/ui/button";
import { PackageIcon, PlusIcon } from "lucide-react";
import { useCallback } from "react";
import { ProductsList } from "./components/list";
import { useProduct } from "./hooks";

export function ProductsPage() {
  const {
    products,
    pagination,
    isLoading,
    setShowCreateForm,
    handleEditProduct,
    handleDeleteProduct,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useProduct();

  const handleCreateProduct = useCallback(() => {
    setShowCreateForm(true);
  }, [setShowCreateForm]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl">
            <PackageIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateProduct}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <ProductsList
        products={products}
        pagination={pagination}
        isLoading={isLoading}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onBulkDelete={handleBulkDelete}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}
