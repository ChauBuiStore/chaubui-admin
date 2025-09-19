"use client";

import { Button } from "@/components/ui";
import { PaletteIcon, PlusIcon } from "lucide-react";
import { useCallback } from "react";
import { ColorsList } from "./components/list";
import { useColor } from "./hooks";
import { CreateColor, DeleteColor, EditColor } from "./modals";

export function ColorsPage() {
  const {
    colors,
    pagination,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingColor,
    selectedColor,
    selectedColors,
    isSubmitting,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditColor,
    handleDeleteConfirm,
    handleDeleteColor,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useColor();

  const handleCreateColor = useCallback(() => {
    setShowCreateForm(true);
  }, [setShowCreateForm]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PaletteIcon className="h-8 w-8" />
            Color Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateColor}>
            <PlusIcon className="h-4 w-4" />
            Add Color
          </Button>
        </div>
      </div>

      <ColorsList
        colors={colors}
        pagination={pagination}
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        onEditColor={handleEditColor}
        onDeleteColor={handleDeleteColor}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
      />

      <CreateColor
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateSubmit}
        loading={isSubmitting}
      />

      <EditColor
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSubmit={handleEditSubmit}
        loading={isSubmitting}
        color={editingColor}
      />

      <DeleteColor
        open={showDeleteForm}
        onOpenChange={setShowDeleteForm}
        onConfirm={handleDeleteConfirm}
        loading={isSubmitting}
        selectedColors={selectedColors}
        color={selectedColor}
      />
    </div>
  );
}
