import { useSearchParams } from "@/lib/hooks";
import { CategoryGroupService, CategoryService } from "@/lib/services";
import { PaginationMeta } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState, useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/categories.type";

export function useCategory() {
  const queryClient = useQueryClient();

  const { filters, setFilter } = useSearchParams({
    page: "1",
    limit: "10",
    search: "",
  });

  const {
    data: categoriesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const response = await CategoryService.getCategories(filters);
      return response;
    },
    select: (data) =>
      ({
        categories: data.data || [],
        pagination: data.meta,
      } as { categories: Category[]; pagination: PaginationMeta }),
  });

  const { data: categoryGroupsData } = useQuery({
    queryKey: ["category-groups", filters],
    queryFn: async () => {
      const response = await CategoryGroupService.getCategoryGroups(filters);
      return response;
    },
    select: (data) => ({
      categoryGroups: data.data || [],
    }),
  });

  if (error) {
    toast.error((error as Error).message);
  }

  const categories = categoriesData?.categories || [];
  const categoryGroups = categoryGroupsData?.categoryGroups || [];
  const pagination = categoriesData?.pagination;

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      CategoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-group"] });
      toast.success("Category created successfully!");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      CategoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-group"] });
      toast.success("Category updated successfully!");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-group"] });
      toast.success("Category deleted successfully!");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => CategoryService.bulkDeleteCategories(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-group"] });
      toast.success(`Successfully deleted ${ids.length} categories!`);
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateCategoryRequest);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingCategory) return;

    await updateMutation.mutateAsync({
      id: editingCategory.id,
      data: data as UpdateCategoryRequest,
    });
    setShowEditForm(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
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
      toast.error((error as Error).message);
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
        page: page.toString(),
        limit: "10"
      });
    },
    [setFilter]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        limit: pageSize.toString(),
        search: "",
        page: "1"
      });
    },
    [setFilter]
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setFilter({
        search: searchTerm,
        page: "1",
        limit: "10"
      });
    },
    [setFilter]
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
    editingCategory,
    setEditingCategory,
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
