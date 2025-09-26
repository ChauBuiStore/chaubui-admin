"use client";

import { XButton } from "@/components/common";
import { PackageIcon, PlusIcon } from "lucide-react";
import { useCallback } from "react";
import { ProductsList } from "./components/list";
import { useProduct } from "./hooks";
import { CreateProduct, DeleteProduct, EditProduct } from "./modals";

export function ProductsPage() {
  const {
    products,
    categories,
    colors,
    sizes,
    pagination,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingProduct,
    selectedProduct,
    selectedProducts,
    isSubmitting,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditProduct,
    handleDeleteConfirm,
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
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl">
            <PackageIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <XButton
            onClick={handleCreateProduct}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Product
          </XButton>
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

      <CreateProduct
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateSubmit}
        loading={isSubmitting}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />

      <EditProduct
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSubmit={handleEditSubmit}
        loading={isSubmitting}
        product={editingProduct}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />

      <DeleteProduct
        open={showDeleteForm}
        onOpenChange={setShowDeleteForm}
        onConfirm={handleDeleteConfirm}
        loading={isSubmitting}
        product={selectedProduct}
        selectedProducts={selectedProducts}
      />
    </>
  );
}
