import { useSearchParams } from "@/lib/hooks";
import { CategoryGroupService } from "@/lib/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { CategoryGroup, CreateCategoryGroup, UpdateCategoryGroup } from "../types/categories-group.type";

export function useCategoryGroup() {
  const queryClient = useQueryClient();

  const { filters, setFilter } = useSearchParams({
    page: "1",
    limit: "10",
  });

  const {
    data: categoriesGroupData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories-group", filters],
    queryFn: async () => {
      const response = await CategoryGroupService.getCategoryGroups(filters);
      if (!response) {
        throw new Error("Failed to fetch category groups");
      }
      return response;
    },
    enabled: true,
  });

  if (error) {
    toast.error((error as Error).message);
  }

  const categoriesGroup = categoriesGroupData?.data || [];
  const meta = categoriesGroupData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryGroup) =>
      CategoryGroupService.createCategoryGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories-group"] });
      toast.success("Category group created successfully!");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryGroup;
    }) => CategoryGroupService.updateCategoryGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories-group"] });
      toast.success("Category group updated successfully!");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryGroupService.deleteCategoryGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories-group"] });
      toast.success("Category group deleted successfully!");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) =>
      CategoryGroupService.bulkDeleteCategoryGroups(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["categories-group"] });
      toast.success(`Successfully deleted ${ids.length} category groups!`);
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [editingCategoryGroup, setEditingCategoryGroup] =
    useState<CategoryGroup | null>(null);
  const [selectedCategoryGroup, setSelectedCategoryGroup] =
    useState<CategoryGroup | null>(null);
  const [selectedCategoryGroups, setSelectedCategoryGroups] = useState<
    CategoryGroup[]
  >([]);

  const handleCreateSubmit = async (data: FieldValues) => {
    await createMutation.mutateAsync(data as CreateCategoryGroup);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingCategoryGroup) return;

    await updateMutation.mutateAsync({
      id: editingCategoryGroup.id,
      data: data as UpdateCategoryGroup,
    });
    setShowEditForm(false);
    setEditingCategoryGroup(null);
  };

  const handleEditCategory = (category: CategoryGroup) => {
    setEditingCategoryGroup(category);
    setShowEditForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedCategoryGroup && selectedCategoryGroups.length === 0) {
        if (
          selectedCategoryGroup.categories &&
          selectedCategoryGroup.categories.length > 0
        ) {
          toast.error(
            `Cannot delete category group "${selectedCategoryGroup.name}" because it contains child categories. Please delete child categories first.`
          );
          setShowDeleteForm(false);
          setSelectedCategoryGroup(null);
          return;
        }

        await deleteMutation.mutateAsync(selectedCategoryGroup.id);
      } else if (selectedCategoryGroups.length > 0) {
        const categoriesWithChildren = selectedCategoryGroups.filter(
          (categoryGroup) =>
            categoryGroup.categories && categoryGroup.categories.length > 0
        );

        if (categoriesWithChildren.length > 0) {
          const categoryNames = categoriesWithChildren
            .map((cat) => cat.name)
            .join(", ");
          toast.error(
            `Cannot delete category groups "${categoryNames}" because they contain child categories. Please delete child categories first.`
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
      toast.error((error as Error).message);
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

  const handlePageChange = useCallback((page: number) => {
    setFilter({
      page: page.toString(),
      limit: "10",
      search: ""
    });
  }, [setFilter]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilter({
      page: "1",
      limit: pageSize.toString(),
      search: ""
    });
  }, [setFilter]);

  const handleSearchChange = useCallback((searchTerm: string) => {
    setFilter({
      search: searchTerm,
      page: "1",
      limit: "10"
    });
  }, [setFilter]);

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
    setEditingCategoryGroup,
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
  };
}
