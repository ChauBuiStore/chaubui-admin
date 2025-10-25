import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import {
  CategoryGroup,
  CategoryGroupFilters,
  CreateCategoryGroupData,
  UpdateCategoryGroupData,
} from "@/modules/category-group/types/category-group.type";

export const categoryGroupService = {
  getCategoryGroups: async (
    filters?: CategoryGroupFilters,
  ): Promise<ApiResponse<CategoryGroup[]>> => {
    const response = await authFetcher.get<CategoryGroup[]>(ENDPOINTS.CATEGORY_GROUP.GET_ALL, {
      params: filters,
    });

    return response;
  },

  getCategoryGroupById: async (id: string): Promise<ApiResponse<CategoryGroup>> => {
    const response = await authFetcher.get<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.GET_BY_ID.replace(":id", id),
    );
    return response;
  },

  createCategoryGroup: async (
    data: CreateCategoryGroupData,
  ): Promise<ApiResponse<CategoryGroup>> => {
    const response = await authFetcher.post<CategoryGroup>(ENDPOINTS.CATEGORY_GROUP.CREATE, data);
    return response;
  },

  updateCategoryGroup: async (
    id: string,
    data: UpdateCategoryGroupData,
  ): Promise<ApiResponse<CategoryGroup>> => {
    const response = await authFetcher.put<CategoryGroup>(
      ENDPOINTS.CATEGORY_GROUP.UPDATE.replace(":id", id),
      data,
    );
    return response;
  },

  deleteCategoryGroup: async (id: string): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(
      ENDPOINTS.CATEGORY_GROUP.DELETE.replace(":id", id),
    );
    return response;
  },

  bulkDeleteCategoryGroups: async (ids: string[]): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.CATEGORY_GROUP.BULK_DELETE, {
      ids,
    });
    return response;
  },
};
