import { ENDPOINTS, httpClient } from "@/lib/configs";
import { PaginatedResponse } from "@/lib/types";
import {
  CategoryGroup,
  CategoryGroupFilters,
  CreateCategoryGroupData,
  UpdateCategoryGroupData,
} from "@/modules/categories-group/types";

class CategoryGroupService {
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
    data: CreateCategoryGroupData
  ): Promise<CategoryGroup> {
    const response = await httpClient.post<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.CREATE,
      data
    );
    return response.data;
  }

  static async updateCategoryGroup(
    id: string,
    data: UpdateCategoryGroupData
  ): Promise<CategoryGroup> {
    const response = await httpClient.put<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  }

  static async deleteCategoryGroup(id: string): Promise<void> {
    await httpClient.delete<void>(
      ENDPOINTS.CATEGORY_GROUP.DELETE.replace(":id", id)
    );
  }

  static async bulkDeleteCategoryGroups(ids: string[]): Promise<void> {
    await httpClient.delete<void>(ENDPOINTS.CATEGORY_GROUP.BULK_DELETE, {
      ids,
    });
  }
}

export default CategoryGroupService;
