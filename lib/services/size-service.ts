import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import { CreateSizeData, Size, SizeFilters, UpdateSizeData } from "@/modules/size/types/size.type";

export const sizeService = {
  getSizes: async (filters?: SizeFilters): Promise<ApiResponse<Size[]>> => {
    const response = await authFetcher.get<Size[]>(ENDPOINTS.SIZE.GET_ALL, {
      params: filters,
    });
    return response;
  },

  getSizeById: async (id: string): Promise<ApiResponse<Size>> => {
    const response = await authFetcher.get<Size>(ENDPOINTS.SIZE.GET_BY_ID.replace(":id", id));
    return response;
  },

  createSize: async (data: CreateSizeData): Promise<ApiResponse<Size>> => {
    const response = await authFetcher.post<Size>(ENDPOINTS.SIZE.CREATE, data);
    return response;
  },

  updateSize: async (id: string, data: UpdateSizeData): Promise<ApiResponse<Size>> => {
    const response = await authFetcher.put<Size>(ENDPOINTS.SIZE.UPDATE.replace(":id", id), data);
    return response;
  },

  deleteSize: async (id: string): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.SIZE.DELETE.replace(":id", id));
    return response;
  },

  bulkDeleteSizes: async (ids: string[]): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.SIZE.BULK_DELETE, { ids });
    return response;
  },
};
