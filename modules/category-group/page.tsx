"use client";

import { Button } from "@/components/ui/button";
import { FolderIcon, PlusIcon } from "lucide-react";
import { CategoriesGroupList } from "./components/list";
import { useCategoryGroup } from "./hooks";
import {
  CreateCategoryGroup,
  DeleteCategoryGroup,
  EditCategoryGroup,
} from "./modals";

export function CategoriesGroupPage() {
  const {
    categoriesGroup,
    meta,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingCategoryGroup,
    setEditingCategoryGroup,
    selectedCategoryGroup,
    selectedCategoryGroups,
    isSubmitting,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditCategory,
    handleDeleteConfirm,
    handleDeleteCategory,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useCategoryGroup();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderIcon className="h-8 w-8" />
            <span>Category Group Management</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
            <PlusIcon className="h-4 w-4" />
            <span>Add Category Group</span>
          </Button>
        </div>
      </div>

      <CategoriesGroupList
        categoriesGroup={categoriesGroup}
        pagination={meta}
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
      />

      <CreateCategoryGroup
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateSubmit}
        loading={isSubmitting}
      />

      <EditCategoryGroup
        open={showEditForm}
        onOpenChange={(open) => {
          setShowEditForm(open);
          if (!open) {
            setEditingCategoryGroup(null);
          }
        }}
        onSubmit={handleEditSubmit}
        loading={isSubmitting}
        categoryGroup={editingCategoryGroup}
      />

      <DeleteCategoryGroup
        open={showDeleteForm}
        onOpenChange={setShowDeleteForm}
        onConfirm={handleDeleteConfirm}
        loading={isSubmitting}
        categoryGroup={selectedCategoryGroup}
        selectedCategoryGroups={selectedCategoryGroups}
      />
    </div>
  );
}
