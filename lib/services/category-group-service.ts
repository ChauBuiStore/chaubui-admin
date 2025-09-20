import { ENDPOINTS, httpClient } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import {
  CategoryGroup,
  CategoryGroupFilters,
  CreateCategoryGroupData,
  UpdateCategoryGroupData,
} from "@/modules/category-group/types";

class CategoryGroupService {
  static async getCategoryGroups(
    filters?: CategoryGroupFilters
  ): Promise<ApiResponse<CategoryGroup[]>> {
    const response = await httpClient.get<CategoryGroup[]>(
      ENDPOINTS.CATEGORY_GROUP.GET_ALL,
      {
        params: filters,
      }
    );

    return response;
  }

  static async createCategoryGroup(
    data: CreateCategoryGroupData
  ): Promise<ApiResponse<CategoryGroup>> {
    const response = await httpClient.post<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.CREATE,
      data
    );
    return response;
  }

  static async updateCategoryGroup(
    id: string,
    data: UpdateCategoryGroupData
  ): Promise<ApiResponse<CategoryGroup>> {
    const response = await httpClient.put<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.UPDATE.replace(":id", id),
      data
    );
    return response;
  }

  static async deleteCategoryGroup(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(
      ENDPOINTS.CATEGORY_GROUP.DELETE.replace(":id", id)
    );
    return response;
  }

  static async bulkDeleteCategoryGroups(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.CATEGORY_GROUP.BULK_DELETE, {
      ids,
    });
    return response;
  }
}

export default CategoryGroupService;
