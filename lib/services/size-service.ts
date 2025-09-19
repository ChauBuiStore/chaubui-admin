import { ENDPOINTS, httpClient } from "@/lib/configs";
import { PaginatedResponse, ApiResponse } from "@/lib/types";
import {
  CreateSizeData,
  Size,
  SizeFilters,
  UpdateSizeData,
} from "@/modules/size/types";

class SizeService {
  static async getSizes(
    filters?: SizeFilters
  ): Promise<ApiResponse<PaginatedResponse<Size>>> {
    const response = await httpClient.get<PaginatedResponse<Size>>(
      ENDPOINTS.SIZE.GET_ALL,
      {
        params: filters,
      }
    );
    return response;
  }

  static async getSizeById(id: string): Promise<ApiResponse<Size>> {
    const response = await httpClient.get<Size>(
      ENDPOINTS.SIZE.GET_BY_ID.replace(":id", id)
    );
    return response;
  }

  static async createSize(data: CreateSizeData): Promise<ApiResponse<Size>> {
    const response = await httpClient.post<Size>(ENDPOINTS.SIZE.CREATE, data);
    return response;
  }

  static async updateSize(id: string, data: UpdateSizeData): Promise<ApiResponse<Size>> {
    const response = await httpClient.put<Size>(
      ENDPOINTS.SIZE.UPDATE.replace(":id", id),
      data
    );
    return response;
  }

  static async deleteSize(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.SIZE.DELETE.replace(":id", id));
    return response;
  }

  static async bulkDeleteSizes(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.SIZE.BULK_DELETE, { ids });
    return response;
  }
}

export default SizeService;
