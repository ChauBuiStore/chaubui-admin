"use client";

import { FolderIcon, PlusIcon } from "lucide-react";

import { XButton } from "@/components/common";

import { CategoriesGroupList } from "../components/list";
import { useCategoryGroup } from "../hooks/use-category-group";
import { CreateCategoryGroup } from "../modals/create";
import { DeleteCategoryGroup } from "../modals/delete";
import { EditCategoryGroup } from "../modals/edit";

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
    isLoadingEditData,
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
    setEditingCategoryGroupId,
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
          <XButton onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
            <PlusIcon className="h-4 w-4" />
            <span>Add Category Group</span>
          </XButton>
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
        onOpenChange={setShowEditForm}
        onSubmit={handleEditSubmit}
        loading={isSubmitting}
        categoryGroup={editingCategoryGroup}
        isLoadingData={isLoadingEditData}
        onClose={() => setEditingCategoryGroupId(null)}
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
