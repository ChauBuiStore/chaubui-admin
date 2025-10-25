"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { menuService } from "@/lib/services";
import { CreateMenuData, Menu, UpdateMenuData } from "@/modules/menu/types/menu.type";

export function useMenu() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const { filters, setFilter } = useSearchParams();

  const {
    data: menusData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.MENU, filters],
    queryFn: () => menuService.getMenus(filters),
  });

  if (error) {
    showError((error as Error).message);
  }

  const menus = menusData?.data || [];
  const pagination = menusData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateMenuData) => menuService.createMenu(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU_BY_ID] });
      success("Menu created successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuData }) =>
      menuService.updateMenu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU_BY_ID] });
      success("Menu updated successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuService.deleteMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENU_BY_ID] });
      success("Menu deleted successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => menuService.bulkDeleteMenus(ids),
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
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedMenus, setSelectedMenus] = useState<Menu[]>([]);

  const { data: editingMenuData, isLoading: isLoadingEditData } = useQuery({
    queryKey: [QUERY_KEYS.MENU_BY_ID, editingMenuId],
    queryFn: () => menuService.getMenuById(editingMenuId!),
    enabled: !!editingMenuId,
    select: (data) => data.data,
  });

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateMenuData);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingMenuData) return;

    await updateMutation.mutateAsync({
      id: editingMenuData.id,
      data: data as UpdateMenuData,
    });
    setShowEditForm(false);
    setEditingMenuId(null);
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenuId(menu.id);
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
        limit: filters.limit,
        search: filters.search,
      });
    },
    [setFilter, filters.limit, filters.search],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
        search: filters.search,
      });
    },
    [setFilter, filters.search],
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setFilter({
        search: searchTerm,
        page: PAGINATION_CONSTANTS.PAGE,
        limit: filters.limit,
      });
    },
    [setFilter, filters.limit],
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
    editingMenu: editingMenuData,
    isLoadingEditData,
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
