import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { categoryGroupService } from "@/lib/services";
import {
  CategoryGroup,
  CreateCategoryGroupData,
  UpdateCategoryGroupData,
} from "@/modules/category-group/types/category-group.type";

export function useCategoryGroup() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { filters, setFilter } = useSearchParams({
    keyword: undefined,
  });

  const {
    data: categoryGroupData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_GROUP, filters],
    queryFn: () => categoryGroupService.getCategoryGroups(filters),
  });

  if (error) {
    showError((error as Error).message);
  }

  const categoriesGroup = categoryGroupData?.data || [];
  const meta = categoryGroupData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryGroupData) => categoryGroupService.createCategoryGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP] });
      success("Category group created successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryGroupData }) =>
      categoryGroupService.updateCategoryGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP_BY_ID] });
      success("Category group updated successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryGroupService.deleteCategoryGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP] });
      success("Category group deleted successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => categoryGroupService.bulkDeleteCategoryGroups(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_GROUP] });
      success(`Successfully deleted ${ids.length} category groups!`);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [editingCategoryGroupId, setEditingCategoryGroupId] = useState<string | null>(null);
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<CategoryGroup | null>(null);
  const [selectedCategoryGroups, setSelectedCategoryGroups] = useState<CategoryGroup[]>([]);

  const { data: editingCategoryGroup, isLoading: isLoadingEditData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_GROUP_BY_ID, editingCategoryGroupId],
    queryFn: () => categoryGroupService.getCategoryGroupById(editingCategoryGroupId!),
    enabled: !!editingCategoryGroupId,
    select: (data) => data.data,
  });

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateCategoryGroupData);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingCategoryGroup) return;

    await updateMutation.mutateAsync({
      id: editingCategoryGroup.id || "",
      data: data as UpdateCategoryGroupData,
    });
    setShowEditForm(false);
    setEditingCategoryGroupId(null);
  };

  const handleEditCategory = (category: CategoryGroup) => {
    setEditingCategoryGroupId(category.id);
    setShowEditForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedCategoryGroup && selectedCategoryGroups.length === 0) {
        if (selectedCategoryGroup.categories && selectedCategoryGroup.categories.length > 0) {
          showError(
            `Không thể xóa nhóm danh mục "${selectedCategoryGroup.nameVi}" vì còn danh mục con. Vui lòng xóa danh mục con trước.`,
          );
          setShowDeleteForm(false);
          setSelectedCategoryGroup(null);
          return;
        }

        await deleteMutation.mutateAsync(selectedCategoryGroup.id);
      } else if (selectedCategoryGroups.length > 0) {
        const categoriesWithChildren = selectedCategoryGroups.filter(
          (categoryGroup) => categoryGroup.categories && categoryGroup.categories.length > 0,
        );

        if (categoriesWithChildren.length > 0) {
          const categoryNames = categoriesWithChildren.map((cat) => cat.nameVi).join(", ");
          showError(
            `Không thể xóa các nhóm danh mục "${categoryNames}" vì còn danh mục con. Vui lòng xóa danh mục con trước.`,
          );
          setShowDeleteForm(false);
          setSelectedCategoryGroups([]);
          return;
        }

        const ids = selectedCategoryGroups.map((category) => category.id);
        await bulkDeleteMutation.mutateAsync(ids);
      }

      setShowDeleteForm(false);
      setSelectedCategoryGroup(null);
      setSelectedCategoryGroups([]);
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const handleDeleteCategory = (category: CategoryGroup) => {
    setSelectedCategoryGroup(category);
    setSelectedCategoryGroups([]);
    setShowDeleteForm(true);
  };

  const handleBulkDelete = (selectedCategories: CategoryGroup[]) => {
    setSelectedCategoryGroups(selectedCategories);
    setSelectedCategoryGroup(null);
    setShowDeleteForm(true);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      setFilter({
        page,
        limit: PAGINATION_CONSTANTS.LIMIT,
        keyword: filters.keyword || undefined,
      });
    },
    [setFilter, filters.keyword],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        page: PAGINATION_CONSTANTS.PAGE,
        limit: pageSize,
        keyword: filters.keyword || undefined,
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
    setEditingCategoryGroupId,
  };
}
