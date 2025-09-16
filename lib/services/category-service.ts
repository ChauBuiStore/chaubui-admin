import { ENDPOINTS } from "@/lib/config";
import { httpClient } from "@/lib/config/http-client";
import { PaginatedResponse } from "@/lib/types";
import {
  Category,
  CategoryFilters,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/modules/categories/types/categories.type";

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

  static async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await httpClient.post<Category>(
      ENDPOINTS.CATEGORY.CREATE,
      data
    );
    return response.data;
  }

  static async updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<Category> {
    const response = await httpClient.put<Category>(
      ENDPOINTS.CATEGORY.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  }

  static async deleteCategory(id: string): Promise<Category> {
    const response = await httpClient.delete<Category>(
      ENDPOINTS.CATEGORY.DELETE.replace(":id", id)
    );
    return response.data;
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
