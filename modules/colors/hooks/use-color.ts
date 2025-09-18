"use client";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { ColorService } from "@/lib/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Color, CreateColorRequest, UpdateColorRequest } from "../types";

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
    queryFn: () => ColorService.getColors(filters),
  });

  if (error) {
    showError((error as Error).message);
  }

  const colors = colorsData?.data || [];
  const pagination = colorsData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateColorRequest) =>
      ColorService.createColor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLORS] });
      success("Color created successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColorRequest }) =>
      ColorService.updateColor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLORS] });
      success("Color updated successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ColorService.deleteColor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLORS] });
      success("Color deleted successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => ColorService.bulkDeleteColors(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COLORS] });
      success(`Successfully deleted ${ids.length} colors!`);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    null
  );
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateColorRequest);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingColor) return;

    await updateMutation.mutateAsync({
      id: editingColor.id,
      data: data as UpdateColorRequest,
    });
    setShowEditForm(false);
    setEditingColor(null);
  };

  const handleEditColor = (color: Color) => {
      setEditingColor(color);
    setShowEditForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedColor && selectedColors.length === 0) {
        await deleteMutation.mutateAsync(selectedColor.id);
      } else if (selectedColors.length > 0) {
        const ids = selectedColors.map((color) => color.id);
        await bulkDeleteMutation.mutateAsync(ids);
      }

      setShowDeleteForm(false);
      setSelectedColor(null);
      setSelectedColors([]);
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
      setFilter({
        page,
        limit: PAGINATION_CONSTANTS.LIMIT,
        search: filters.search || ""
      });
    },
    [setFilter, filters.search]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
        search: filters.search || ""
      });
    },
    [setFilter, filters.search]
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setFilter({
        search: searchTerm,
        page: PAGINATION_CONSTANTS.PAGE,
        limit: PAGINATION_CONSTANTS.LIMIT
      });
    },
    [setFilter]
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
    editingColor,
    setEditingColor,
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
