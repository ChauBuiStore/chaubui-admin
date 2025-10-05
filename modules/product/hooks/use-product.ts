"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { CategoryService, ColorService, ProductService, SizeService } from "@/lib/services";
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
    queryFn: () => ProductService.getProducts(filters),
  });

  const { data: editingProductData, isLoading: isLoadingEditingProduct } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "detail", editingProductId],
    queryFn: () => ProductService.getProductById(editingProductId!),
    enabled: !!editingProductId,
  });

  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_ALL],
    queryFn: () => CategoryService.getCategories({ isAll: true }),
  });

  const { data: colorsData } = useQuery({
    queryKey: [QUERY_KEYS.COLORS_ALL],
    queryFn: () => ColorService.getColors({ isAll: true }),
  });

  const { data: sizesData } = useQuery({
    queryKey: [QUERY_KEYS.SIZES_ALL],
    queryFn: () => SizeService.getSizes({ isAll: true }),
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
      return ProductService.createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      success("Product created successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      ProductService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      success("Product updated successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      success("Product deleted successfully!");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => ProductService.bulkDeleteProducts(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      success(`Successfully deleted ${ids.length} products!`);
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
        showError("Some images have invalid data. Please check and try again.");
        return;
      }

      const sortOrders = data.images.map((img: { sortOrder?: number }) => img.sortOrder as number);
      const duplicateSortOrders = sortOrders.filter(
        (order: number, index: number) => sortOrders.indexOf(order) !== index,
      );

      if (duplicateSortOrders.length > 0) {
        showError("Images have duplicate sort orders. Please check and try again.");
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

  // Chỉ mở form khi có dữ liệu product
  const shouldShowEditForm = showEditForm && !!editingProductData?.data;

  // Loading state cho edit form
  const isEditFormLoading = showEditForm && (isLoadingEditingProduct || !editingProductData?.data);

  // Đảm bảo editingProduct luôn có giá trị khi form mở
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
      setFilter({
        page,
        limit: PAGINATION_CONSTANTS.LIMIT,
        search: filters.search || "",
      });
    },
    [setFilter, filters.search],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
        search: filters.search || "",
      });
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
