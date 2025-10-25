import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import {
  Color,
  ColorFilters,
  CreateColorRequest,
  UpdateColorRequest,
} from "@/modules/color/types/color.type";

export const colorService = {
  getColors: async (filters?: ColorFilters): Promise<ApiResponse<Color[]>> => {
    const response = await authFetcher.get<Color[]>(ENDPOINTS.COLOR.GET_ALL, {
      params: filters,
    });
    return response;
  },

  getColorById: async (id: string): Promise<ApiResponse<Color>> => {
    const response = await authFetcher.get<Color>(ENDPOINTS.COLOR.GET_BY_ID.replace(":id", id));
    return response;
  },

  createColor: async (data: CreateColorRequest): Promise<ApiResponse<Color>> => {
    const response = await authFetcher.post<Color>(ENDPOINTS.COLOR.CREATE, data);
    return response;
  },

  updateColor: async (id: string, data: UpdateColorRequest): Promise<ApiResponse<Color>> => {
    const response = await authFetcher.put<Color>(ENDPOINTS.COLOR.UPDATE.replace(":id", id), data);
    return response;
  },

  deleteColor: async (id: string): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.COLOR.DELETE.replace(":id", id));
    return response;
  },

  bulkDeleteColors: async (ids: string[]): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.COLOR.BULK_DELETE, { ids });
    return response;
  },
};
