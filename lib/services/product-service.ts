import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import {
  CreateProductData,
  Product,
  ProductFilters,
  UpdateProductData,
} from "@/modules/product/types";

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    const response = await authFetcher.get<Product[]>(ENDPOINTS.PRODUCT.GET_ALL, {
      params: filters,
    });
    return response;
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await authFetcher.get<Product>(ENDPOINTS.PRODUCT.GET_BY_ID.replace(":id", id));
    return response;
  },

  createProduct: async (data: CreateProductData): Promise<ApiResponse<Product>> => {
    const response = await authFetcher.post<Product>(ENDPOINTS.PRODUCT.CREATE, data);
    return response;
  },

  updateProduct: async (id: string, data: UpdateProductData): Promise<ApiResponse<Product>> => {
    const response = await authFetcher.put<Product>(
      ENDPOINTS.PRODUCT.UPDATE.replace(":id", id),
      data,
    );
    return response;
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.PRODUCT.DELETE.replace(":id", id));
    return response;
  },

  bulkDeleteProducts: async (ids: string[]): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.PRODUCT.BULK_DELETE, { ids });
    return response;
  },
};
