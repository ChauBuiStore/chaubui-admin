"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { PRODUCT_MESSAGES } from "@/lib/constants/message.constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { categoryService, colorService, productService, sizeService } from "@/lib/services";
import { CreateProductData, Product, UpdateProductData } from "@/modules/product/types";

export function useProduct() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { filters, setFilter } = useSearchParams({
    search: undefined,
  });

  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const {
    data: productsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filters],
    queryFn: () => productService.getProducts(filters),
  });

  const { data: editingProductData, isLoading: isLoadingEditingProduct } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "detail", editingProductId],
    queryFn: () => productService.getProductById(editingProductId!),
    enabled: !!editingProductId,
  });

  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_ALL],
    queryFn: () => categoryService.getCategories({ isAll: true }),
  });

  const { data: colorsData } = useQuery({
    queryKey: [QUERY_KEYS.COLORS_ALL],
    queryFn: () => colorService.getColors({ isAll: true }),
  });

  const { data: sizesData } = useQuery({
    queryKey: [QUERY_KEYS.SIZES_ALL],
    queryFn: () => sizeService.getSizes({ isAll: true }),
  });

  if (error) {
    showError((error as Error).message);
  }

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];
  const colors = colorsData?.data || [];
  const sizes = sizesData?.data || [];
  const pagination = productsData?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateProductData) => {
      return productService.createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      success(PRODUCT_MESSAGES.CREATED_SUCCESS);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      success(PRODUCT_MESSAGES.UPDATED_SUCCESS);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      success(PRODUCT_MESSAGES.DELETED_SUCCESS);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => productService.bulkDeleteProducts(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      success(PRODUCT_MESSAGES.BULK_DELETED_SUCCESS(ids.length));
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleCreateSubmit = async (data: FieldValues) => {
    try {
      await createMutation.mutateAsync(data as CreateProductData);
      setShowCreateForm(false);
    } catch (error) {
      throw error;
    }
  };

  const handleEditSubmit = async (data: FieldValues) => {
    if (!editingProductId) return;

    if (data.images?.length > 0) {
      const invalidImages = data.images.filter(
        (img: { fileId?: string; alt?: string; sortOrder?: number }) =>
          !img.fileId || !img.alt || typeof img.sortOrder !== "number" || img.sortOrder < 1,
      );

      if (invalidImages.length > 0) {
        showError(PRODUCT_MESSAGES.INVALID_IMAGES_DATA);
        return;
      }

      const sortOrders = data.images.map((img: { sortOrder?: number }) => img.sortOrder as number);
      const duplicateSortOrders = sortOrders.filter(
        (order: number, index: number) => sortOrders.indexOf(order) !== index,
      );

      if (duplicateSortOrders.length > 0) {
        showError(PRODUCT_MESSAGES.DUPLICATE_SORT_ORDERS);
        return;
      }
    }

    try {
      await updateMutation.mutateAsync({
        id: editingProductId,
        data: data as UpdateProductData,
      });
      setShowEditForm(false);
      setEditingProductId(null);
    } catch {}
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setShowEditForm(true);
  };

  const handleCloseEditForm = useCallback((open: boolean) => {
    setShowEditForm(open);
    if (!open) {
      setEditingProductId(null);
    }
  }, []);

  const shouldShowEditForm = showEditForm && !!editingProductData?.data;

  const isEditFormLoading = showEditForm && (isLoadingEditingProduct || !editingProductData?.data);

  const safeEditingProduct = shouldShowEditForm ? editingProductData?.data || null : null;

  const handleDeleteConfirm = async () => {
    try {
      if (selectedProduct && selectedProducts.length === 0) {
        await deleteMutation.mutateAsync(selectedProduct.id);
      } else if (selectedProducts.length > 0) {
        const ids = selectedProducts.map((product) => product.id);
        await bulkDeleteMutation.mutateAsync(ids);
      }

      setShowDeleteForm(false);
      setSelectedProduct(null);
      setSelectedProducts([]);
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProducts([]);
    setShowDeleteForm(true);
  };

  const handleBulkDelete = (selectedProducts: Product[]) => {
    setSelectedProducts(selectedProducts);
    setSelectedProduct(null);
    setShowDeleteForm(true);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      const filterUpdate: { page: number; limit: number; search?: string } = {
        page,
        limit: PAGINATION_CONSTANTS.LIMIT,
      };
      if (filters.search) {
        filterUpdate.search =
          typeof filters.search === "string" ? filters.search : String(filters.search);
      }
      setFilter(filterUpdate);
    },
    [setFilter, filters.search],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      const filterUpdate: { limit: number; page: number; search?: string } = {
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
      };
      if (filters.search) {
        filterUpdate.search =
          typeof filters.search === "string" ? filters.search : String(filters.search);
      }
      setFilter(filterUpdate);
    },
    [setFilter, filters.search],
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setFilter({
        search: searchTerm,
        page: PAGINATION_CONSTANTS.PAGE,
        limit: PAGINATION_CONSTANTS.LIMIT,
      });
    },
    [setFilter],
  );

  return {
    products,
    categories,
    colors,
    sizes,
    pagination,
    isLoading,
    showCreateForm,
    setShowCreateForm,
    showEditForm: shouldShowEditForm,
    setShowEditForm: handleCloseEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingProduct: safeEditingProduct,
    selectedProduct,
    selectedProducts,
    isLoadingEditingProduct: isEditFormLoading,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      bulkDeleteMutation.isPending,
    handleCreateSubmit,
    handleEditSubmit,
    handleEditProduct,
    handleDeleteConfirm,
    handleDeleteProduct,
    handleBulkDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  };
}
