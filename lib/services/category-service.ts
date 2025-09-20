import { ENDPOINTS, httpClient } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import {
  Category,
  CategoryFilters,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/modules/category/types";

class CategoryService {
  static async getCategories(
    filters?: CategoryFilters
  ): Promise<ApiResponse<Category[]>> {
    const response = await httpClient.get<Category[]>(
      ENDPOINTS.CATEGORY.GET_ALL,
      {
        params: filters,
      }
    );
    return response;
  }

  static async getAllCategories(
  ): Promise<ApiResponse<Category[]>> {
    const response = await httpClient.get<Category[]>(
      ENDPOINTS.CATEGORY.GET_ALL_CATEGORIES,
    );
    return response;
  }

  static async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await httpClient.get<Category>(
      ENDPOINTS.CATEGORY.GET_BY_ID.replace(":id", id)
    );
    return response;
  }

  static async createCategory(data: CreateCategoryData): Promise<ApiResponse<Category>> {
    const response = await httpClient.post<Category>(
      ENDPOINTS.CATEGORY.CREATE,
      data
    );
    return response;
  }

  static async updateCategory(
    id: string,
    data: UpdateCategoryData
  ): Promise<ApiResponse<Category>> {
    const response = await httpClient.put<Category>(
      ENDPOINTS.CATEGORY.UPDATE.replace(":id", id),
      data
    );
    return response;
  }

  static async deleteCategory(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.CATEGORY.DELETE.replace(":id", id));
    return response;
  }

  static async bulkDeleteCategories(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.CATEGORY.BULK_DELETE, { ids });
    return response;
  }
}

export default CategoryService;
