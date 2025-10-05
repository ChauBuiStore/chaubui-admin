"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { SizeService } from "@/lib/services";
import { CreateSizeData, Size, UpdateSizeData } from "@/modules/size/types";

export function useSize() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const { filters, setFilter } = useSearchParams({
    keyword: undefined,
  });

  const {
    data: sizesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.SIZES, filters],
    queryFn: () => SizeService.getSizes(filters),
  });

  if (error) {
    showError((error as Error).message);
  }

  const sizes = sizesData?.data || [];
  const pagination = sizesData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateSizeData) => SizeService.createSize(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SIZES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SIZE_BY_ID] });
      success("Size created successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSizeData }) =>
      SizeService.updateSize(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SIZES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SIZE_BY_ID] });
      success("Size updated successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SizeService.deleteSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SIZES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SIZE_BY_ID] });
      success("Size deleted successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => SizeService.bulkDeleteSizes(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SIZES] });
      success(`Successfully deleted ${ids.length} sizes!`);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);

  const { data: editingSizeData, isLoading: isLoadingEditData } = useQuery({
    queryKey: [QUERY_KEYS.SIZE_BY_ID, editingSizeId],
    queryFn: () => SizeService.getSizeById(editingSizeId!),
    enabled: !!editingSizeId,
    select: (data) => data.data,
  });

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateSizeData);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingSizeData) return;

    await updateMutation.mutateAsync({
      id: editingSizeData.id,
      data: data as UpdateSizeData,
    });
    setShowEditForm(false);
    setEditingSizeId(null);
  };

  const handleEditSize = (size: Size) => {
    setEditingSizeId(size.id);
    setShowEditForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedSize && selectedSizes.length === 0) {
        await deleteMutation.mutateAsync(selectedSize.id);
      } else if (selectedSizes.length > 0) {
        const ids = selectedSizes.map((size) => size.id);
        await bulkDeleteMutation.mutateAsync(ids);
      }

      setShowDeleteForm(false);
      setSelectedSize(null);
      setSelectedSizes([]);
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const handleDeleteSize = (size: Size) => {
    setSelectedSize(size);
    setSelectedSizes([]);
    setShowDeleteForm(true);
  };

  const handleBulkDelete = (selectedSizes: Size[]) => {
    setSelectedSizes(selectedSizes);
    setSelectedSize(null);
    setShowDeleteForm(true);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      setFilter({
        page,
        limit: PAGINATION_CONSTANTS.LIMIT,
        keyword: filters.keyword || "",
      });
    },
    [setFilter, filters.keyword],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
        keyword: filters.keyword || "",
      });
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
    sizes,
    pagination,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingSize: editingSizeData,
    isLoadingEditData,
    selectedSize,
    selectedSizes,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      bulkDeleteMutation.isPending,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditSize,
    handleDeleteConfirm,
    handleDeleteSize,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  };
}
