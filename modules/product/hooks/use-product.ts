"use client";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import {
  CategoryService,
  ColorService,
  ProductService,
  SizeService,
} from "@/lib/services";
import {
  CreateProductData,
  Product,
  UpdateProductData,
} from "@/modules/product/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

export function useProduct() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { filters, setFilter } = useSearchParams({
    search: undefined,
  });

  const {
    data: productsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filters],
    queryFn: () => ProductService.getProducts(filters),
  });

  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES_ALL],
    queryFn: () => CategoryService.getCategories(),
  });

  const { data: colorsData } = useQuery({
    queryKey: [QUERY_KEYS.COLORS_ALL],
    queryFn: () => ColorService.getColors(),
  });

  const { data: sizesData } = useQuery({
    queryKey: [QUERY_KEYS.SIZES_ALL],
    queryFn: () => SizeService.getSizes(),
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
    if (!editingProduct) return;

    if (data.images?.length > 0) {
      const invalidImages = data.images.filter(
        (img: {
          fileId?: string;
          alt?: string;
          sortOrder?: number;
          isThumbnail?: boolean;
        }) =>
          !img.fileId ||
          !img.alt ||
          typeof img.sortOrder !== "number" ||
          img.sortOrder < 1 ||
          typeof img.isThumbnail !== "boolean"
      );

      if (invalidImages.length > 0) {
        showError("Some images have invalid data. Please check and try again.");
        return;
      }

      const sortOrders = data.images.map(
        (img: { sortOrder?: number }) => img.sortOrder as number
      );
      const duplicateSortOrders = sortOrders.filter(
        (order: number, index: number) => sortOrders.indexOf(order) !== index
      );

      if (duplicateSortOrders.length > 0) {
        showError(
          "Images have duplicate sort orders. Please check and try again."
        );
        return;
      }

      const thumbnailCount = data.images.filter(
        (img: { isThumbnail?: boolean }) => Boolean(img.isThumbnail)
      ).length;
      if (thumbnailCount > 1) {
        showError(
          "Only one image can be set as thumbnail. Please check and try again."
        );
        return;
      }
    }

    try {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        data: data as UpdateProductData,
      });
      setShowEditForm(false);
      setEditingProduct(null);
    } catch {}
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditForm(true);
  };

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
    [setFilter, filters.search]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
        search: filters.search || "",
      });
    },
    [setFilter, filters.search]
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setFilter({
        search: searchTerm,
        page: PAGINATION_CONSTANTS.PAGE,
        limit: PAGINATION_CONSTANTS.LIMIT,
      });
    },
    [setFilter]
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
    showEditForm,
    setShowEditForm,
    showDeleteForm,
    setShowDeleteForm,
    editingProduct,
    setEditingProduct,
    selectedProduct,
    selectedProducts,
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
