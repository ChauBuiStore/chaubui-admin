"use client";

import { Button } from "@/components/ui";
import { MenuIcon, PlusIcon } from "lucide-react";
import { useCallback } from "react";
import { MenusList } from "./components";
import { useMenu } from "./hooks";
import { CreateMenu, DeleteMenu, EditMenu } from "./modals";

export function MenusPage() {
  const {
    menus,
    pagination,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingMenu,
    selectedMenu,
    selectedMenus,
    isSubmitting,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditMenu,
    handleDeleteConfirm,
    handleDeleteMenu,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useMenu();

  const handleCreateMenu = useCallback(() => {
    setShowCreateForm(true);
  }, [setShowCreateForm]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MenuIcon className="h-8 w-8" />
            Menus
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateMenu}>
            <PlusIcon className="h-4 w-4" />
            Add Menu
          </Button>
        </div>
      </div>

      <MenusList
        menus={menus}
        pagination={pagination}
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        onEditMenu={handleEditMenu}
        onDeleteMenu={handleDeleteMenu}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
      />

      <CreateMenu
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateSubmit}
        loading={isSubmitting}
      />

      <EditMenu
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSubmit={handleEditSubmit}
        loading={isSubmitting}
        menu={editingMenu}
      />

      <DeleteMenu
        open={showDeleteForm}
        onOpenChange={setShowDeleteForm}
        onConfirm={handleDeleteConfirm}
        loading={isSubmitting}
        selectedMenus={selectedMenus}
        menu={selectedMenu}
      />
    </div>
  );
}
