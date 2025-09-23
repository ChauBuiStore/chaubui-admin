"use client";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { MenuService } from "@/lib/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Menu, CreateMenuData, UpdateMenuData } from "../types";

export function useMenu() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const { filters, setFilter } = useSearchParams({
    keyword: undefined,
  });

  const {
    data: menusData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.MENU, filters],
    queryFn: () => MenuService.getMenus(filters),
  });

  if (error) {
    showError((error as Error).message);
  }

  const menus = menusData?.data?.data || [];
  const pagination = menusData?.data?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateMenuData) =>
      MenuService.createMenu(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU] });
      success("Menu created successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuData }) =>
      MenuService.updateMenu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU] });
      success("Menu updated successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });


  const deleteMutation = useMutation({
    mutationFn: (id: string) => MenuService.deleteMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU] });
      success("Menu deleted successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => MenuService.bulkDeleteMenus(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU] });
      success(`Successfully deleted ${ids.length} menus!`);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(
    null
  );
  const [selectedMenus, setSelectedMenus] = useState<Menu[]>([]);

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateMenuData);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingMenu) return;

    await updateMutation.mutateAsync({
      id: editingMenu.id,
      data: data as UpdateMenuData,
    });
    setShowEditForm(false);
    setEditingMenu(null);
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setShowEditForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedMenu && selectedMenus.length === 0) {
        await deleteMutation.mutateAsync(selectedMenu.id);
      } else if (selectedMenus.length > 0) {
        const ids = selectedMenus.map((menu) => menu.id);
        await bulkDeleteMutation.mutateAsync(ids);
      }

      setShowDeleteForm(false);
      setSelectedMenu(null);
      setSelectedMenus([]);
    } catch (error) {
      showError((error as Error).message);
    }
  };


  const handleDeleteMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setSelectedMenus([]);
    setShowDeleteForm(true);
  };

  const handleBulkDelete = (selectedMenus: Menu[]) => {
    setSelectedMenus(selectedMenus);
    setSelectedMenu(null);
    setShowDeleteForm(true);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      setFilter({
        page,
        limit: PAGINATION_CONSTANTS.LIMIT,
        keyword: filters.keyword || ""
      });
    },
    [setFilter, filters.keyword]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
        keyword: filters.keyword || ""
      });
    },
    [setFilter, filters.keyword]
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setFilter({
        keyword: searchTerm,
        page: PAGINATION_CONSTANTS.PAGE,
        limit: PAGINATION_CONSTANTS.LIMIT
      });
    },
    [setFilter]
  );

  return {
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
    setEditingMenu,
    selectedMenu,
    selectedMenus,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      bulkDeleteMutation.isPending,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditMenu,
    handleDeleteConfirm,
    handleDeleteMenu,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  };
}
