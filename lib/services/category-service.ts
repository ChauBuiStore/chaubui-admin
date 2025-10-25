import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import {
  Category,
  CategoryFilters,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/modules/category/types/category.type";

export const categoryService = {
  getCategories: async (filters?: CategoryFilters): Promise<ApiResponse<Category[]>> => {
    const response = await authFetcher.get<Category[]>(ENDPOINTS.CATEGORY.GET_ALL, {
      params: filters,
    });
    return response;
  },

  getCategoryById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await authFetcher.get<Category>(
      ENDPOINTS.CATEGORY.GET_BY_ID.replace(":id", id),
    );
    return response;
  },

  createCategory: async (data: CreateCategoryData): Promise<ApiResponse<Category>> => {
    const response = await authFetcher.post<Category>(ENDPOINTS.CATEGORY.CREATE, data);
    return response;
  },

  updateCategory: async (id: string, data: UpdateCategoryData): Promise<ApiResponse<Category>> => {
    const response = await authFetcher.put<Category>(
      ENDPOINTS.CATEGORY.UPDATE.replace(":id", id),
      data,
    );
    return response;
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.CATEGORY.DELETE.replace(":id", id));
    return response;
  },

  bulkDeleteCategories: async (ids: string[]): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.CATEGORY.BULK_DELETE, { ids });
    return response;
  },
};
