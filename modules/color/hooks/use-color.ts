"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { COLOR_MESSAGES } from "@/lib/constants/message.constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { colorService } from "@/lib/services";

import { Color, CreateColorRequest, UpdateColorRequest } from "../types/color.type";

export function useColor() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const { filters, setFilter } = useSearchParams({
    search: undefined,
  });

  const {
    data: colorsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.COLORS, filters],
    queryFn: () => colorService.getColors(filters),
  });

  if (error) {
    showError((error as Error).message);
  }

  const colors = colorsData?.data || [];
  const pagination = colorsData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateColorRequest) => colorService.createColor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLORS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLOR_BY_ID] });
      success(COLOR_MESSAGES.CREATED_SUCCESS);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColorRequest }) =>
      colorService.updateColor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLORS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLOR_BY_ID] });
      success(COLOR_MESSAGES.UPDATED_SUCCESS);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => colorService.deleteColor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLORS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLOR_BY_ID] });
      success(COLOR_MESSAGES.DELETED_SUCCESS);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => colorService.bulkDeleteColors(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLORS] });
      success(COLOR_MESSAGES.BULK_DELETED_SUCCESS(ids.length));
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);

  const { data: editingColorData, isLoading: isLoadingEditData } = useQuery({
    queryKey: [QUERY_KEYS.COLOR_BY_ID, editingColorId],
    queryFn: () => colorService.getColorById(editingColorId!),
    enabled: !!editingColorId,
    select: (data) => data.data,
  });

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateColorRequest);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingColorData) return;

    await updateMutation.mutateAsync({
      id: editingColorData.id,
      data: data as UpdateColorRequest,
    });
    setShowEditForm(false);
    setEditingColorId(null);
  };

  const handleEditColor = (color: Color) => {
    setEditingColorId(color.id);
    setShowEditForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedColor) {
        await deleteMutation.mutateAsync(selectedColor.id);
      } else if (selectedColors.length > 0) {
        const ids = selectedColors.map((color) => color.id);
        await bulkDeleteMutation.mutateAsync(ids);
      }

      setShowDeleteForm(false);
      setSelectedColor(null);
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const handleDeleteColor = (color: Color) => {
    setSelectedColor(color);
    setSelectedColors([]);
    setShowDeleteForm(true);
  };

  const handleBulkDelete = (selectedColors: Color[]) => {
    setSelectedColors(selectedColors);
    setSelectedColor(null);
    setShowDeleteForm(true);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      const filterUpdate: { page: number; limit: number; keyword?: string } = {
        page,
        limit: PAGINATION_CONSTANTS.LIMIT,
      };
      if (filters.keyword) {
        filterUpdate.keyword =
          typeof filters.keyword === "string" ? filters.keyword : String(filters.keyword);
      }
      setFilter(filterUpdate);
    },
    [setFilter, filters.keyword],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      const filterUpdate: { limit: number; page: number; keyword?: string } = {
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
      };
      if (filters.keyword) {
        filterUpdate.keyword =
          typeof filters.keyword === "string" ? filters.keyword : String(filters.keyword);
      }
      setFilter(filterUpdate);
    },
    [setFilter, filters.keyword],
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setFilter({
        keyword: searchTerm,
        page: PAGINATION_CONSTANTS.PAGE,
        limit: PAGINATION_CONSTANTS.LIMIT,
      });
    },
    [setFilter],
  );

  return {
    colors,
    pagination,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingColor: editingColorData,
    isLoadingEditData,
    selectedColor,
    selectedColors,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      bulkDeleteMutation.isPending,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditColor,
    handleDeleteConfirm,
    handleDeleteColor,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  };
}
