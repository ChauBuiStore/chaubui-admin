import { ENDPOINTS } from "@/lib/configs";
import { httpClient } from "@/lib/configs/http-client";
import { PaginatedResponse } from "@/lib/types";
import { Category, CategoryFilters, CreateCategoryData, UpdateCategoryData } from "@/modules/categories/types";

export class CategoryService {
  static async getCategories(
    filters?: CategoryFilters
  ): Promise<PaginatedResponse<Category>> {
    const response = await httpClient.get<PaginatedResponse<Category>>(
      ENDPOINTS.CATEGORY.GET_ALL,
      {
        params: filters,
      }
    );
    return response.data;
  }

  static async getCategoryById(id: string): Promise<Category> {
    const response = await httpClient.get<Category>(
      ENDPOINTS.CATEGORY.GET_BY_ID.replace(":id", id)
    );
    return response.data;
  }

  static async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await httpClient.post<Category>(
      ENDPOINTS.CATEGORY.CREATE,
      data
    );
    return response.data;
  }

  static async updateCategory(
    id: string,
    data: UpdateCategoryData
  ): Promise<Category> {
    const response = await httpClient.put<Category>(
      ENDPOINTS.CATEGORY.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  }

  static async deleteCategory(id: string): Promise<void> {
    await httpClient.delete<void>(ENDPOINTS.CATEGORY.DELETE.replace(":id", id));
  }

  static async bulkDeleteCategories(
    ids: string[]
  ): Promise<{ success: boolean; data: unknown }> {
    const response = await httpClient.post<{ success: boolean; data: unknown }>(
      ENDPOINTS.CATEGORY.BULK_DELETE,
      { ids }
    );
    return response.data;
  }
}
