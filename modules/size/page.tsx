"use client";

import { Button } from "@/components/ui";
import { RulerIcon, PlusIcon } from "lucide-react";
import { useCallback } from "react";
import { SizesList } from "./components";
import { useSize } from "./hooks";
import { CreateSize, DeleteSize, EditSize } from "./modals";

export function SizesPage() {
  const {
    sizes,
    pagination,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingSize,
    selectedSize,
    selectedSizes,
    isSubmitting,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditSize,
    handleDeleteConfirm,
    handleDeleteSize,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useSize();

  const handleCreateSize = useCallback(() => {
    setShowCreateForm(true);
  }, [setShowCreateForm]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <RulerIcon className="h-8 w-8" />
            Size Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateSize}>
            <PlusIcon className="h-4 w-4" />
            Add Size
          </Button>
        </div>
      </div>

      <SizesList
        sizes={sizes}
        pagination={pagination}
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        onEditSize={handleEditSize}
        onDeleteSize={handleDeleteSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
      />

      <CreateSize
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateSubmit}
        loading={isSubmitting}
      />

      <EditSize
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSubmit={handleEditSubmit}
        loading={isSubmitting}
        size={editingSize}
      />

      <DeleteSize
        open={showDeleteForm}
        onOpenChange={setShowDeleteForm}
        onConfirm={handleDeleteConfirm}
        loading={isSubmitting}
        selectedSizes={selectedSizes}
        size={selectedSize}
      />
    </div>
  );
}
