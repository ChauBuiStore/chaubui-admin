import { httpClient } from "@/lib/config";
import { PaginatedResponse } from "@/lib/types";
import {
  CategoryGroup,
  CategoryGroupFilters,
  CreateCategoryGroup,
  UpdateCategoryGroup,
} from "@/modules/categories-group/types/categories-group.type";
import { ENDPOINTS } from "../config";

export class CategoryGroupService {
  static async getCategoryGroups(
    filters?: CategoryGroupFilters
  ): Promise<PaginatedResponse<CategoryGroup>> {
    const response = await httpClient.get<PaginatedResponse<CategoryGroup>>(
      ENDPOINTS.CATEGORY_GROUP.GET_ALL,
      {
        params: filters,
      }
    );

    return response.data;
  }

  static async createCategoryGroup(
    data: CreateCategoryGroup
  ): Promise<CategoryGroup> {
    const response = await httpClient.post<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.CREATE,
      data
    );
    return response.data;
  }

  static async updateCategoryGroup(
    id: string,
    data: UpdateCategoryGroup
  ): Promise<CategoryGroup> {
    const response = await httpClient.put<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  }

  static async deleteCategoryGroup(id: string): Promise<CategoryGroup> {
    const response = await httpClient.delete<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.DELETE.replace(":id", id)
    );
    return response.data;
  }

  static async bulkDeleteCategoryGroups(
    ids: string[]
  ): Promise<{ success: boolean; deletedCount: number }> {
    const response = await httpClient.delete<{
      success: boolean;
      deletedCount: number;
    }>(ENDPOINTS.CATEGORY_GROUP.BULK_DELETE, {
      body: JSON.stringify({ ids }),
    });

    return response.data;
  }
}
