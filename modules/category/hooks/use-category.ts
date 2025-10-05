import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { CategoryGroupService, CategoryService } from "@/lib/services";
import { Category, CreateCategoryData, UpdateCategoryData } from "@/modules/category/types";

export function useCategory() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { filters, setFilter } = useSearchParams({
    keyword: undefined,
  });

  const {
    data: categoriesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORY, filters],
    queryFn: () => CategoryService.getCategories(filters),
  });

  const { data: categoryGroupsData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_GROUP_ALL],
    queryFn: () => CategoryGroupService.getCategoryGroups({ isAll: true }),
  });

  if (error) {
    showError((error as Error).message);
  }

  const categories = categoriesData?.data || [];
  const categoryGroups = categoryGroupsData?.data || [];
  const pagination = categoriesData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryData) => CategoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP] });
      success("Category created successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      CategoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP] });
      success("Category updated successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP] });
      success("Category deleted successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => CategoryService.bulkDeleteCategories(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP] });
      success(`Successfully deleted ${ids.length} categories!`);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const { data: editingCategoryData, isLoading: isLoadingEditData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_BY_ID, editingCategoryId],
    queryFn: () => CategoryService.getCategoryById(editingCategoryId!),
    enabled: !!editingCategoryId,
    select: (data) => data.data,
  });

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateCategoryData);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingCategoryData) return;

    await updateMutation.mutateAsync({
      id: editingCategoryData.id,
      data: data as UpdateCategoryData,
    });
    setShowEditForm(false);
    setEditingCategoryId(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setShowEditForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedCategory && selectedCategories.length === 0) {
        await deleteMutation.mutateAsync(selectedCategory.id);
      } else if (selectedCategories.length > 0) {
        const ids = selectedCategories.map((category) => category.id);
        await bulkDeleteMutation.mutateAsync(ids);
      }

      setShowDeleteForm(false);
      setSelectedCategory(null);
      setSelectedCategories([]);
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setSelectedCategories([]);
    setShowDeleteForm(true);
  };

  const handleBulkDelete = (selectedCategories: Category[]) => {
    setSelectedCategories(selectedCategories);
    setSelectedCategory(null);
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
    editingCategory: editingCategoryData || null,
    editingCategoryId,
    setEditingCategoryId,
    isLoadingEditData,
    selectedCategory,
    selectedCategories,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      bulkDeleteMutation.isPending,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditCategory,
    handleDeleteConfirm,
    handleDeleteCategory,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  };
}
