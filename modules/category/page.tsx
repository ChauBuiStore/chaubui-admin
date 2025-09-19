"use client";

import { Button } from "@/components/ui/button";
import { FolderIcon, PlusIcon } from "lucide-react";
import { useCallback } from "react";
import { CategoriesList } from "./components/list";
import { CreateCategory, EditCategory, DeleteCategory } from "./modals";
import { useCategory } from "./hooks";

export function CategoriesPage() {
  const {
    categories,
    categoryGroups,
    pagination,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingCategory,
    selectedCategory,
    selectedCategories,
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
  } = useCategory();

  const handleCreateCategory = useCallback(() => {
    setShowCreateForm(true);
  }, [setShowCreateForm]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderIcon className="h-8 w-8" />
            Categories
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateCategory}>
            <PlusIcon className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      <CategoriesList
        categories={categories}
        pagination={pagination}
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
      />

      <CreateCategory
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateSubmit}
        loading={isSubmitting}
        categoryGroups={categoryGroups}
      />

      <EditCategory
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSubmit={handleEditSubmit}
        loading={isSubmitting}
        categoryGroups={categoryGroups}
        category={editingCategory}
      />

      <DeleteCategory
        open={showDeleteForm}
        onOpenChange={setShowDeleteForm}
        onConfirm={handleDeleteConfirm}
        loading={isSubmitting}
        category={selectedCategory}
        selectedCategories={selectedCategories}
      />
    </div>
  );
}
