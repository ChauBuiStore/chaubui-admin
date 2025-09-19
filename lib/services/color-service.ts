import { ENDPOINTS, httpClient } from "@/lib/configs";
import { PaginatedResponse, ApiResponse } from "@/lib/types";
import {
  Color,
  ColorFilters,
  CreateColorRequest,
  UpdateColorRequest,
} from "@/modules/color/types";

class ColorService {
  static async getColors(
    filters?: ColorFilters
  ): Promise<ApiResponse<PaginatedResponse<Color>>> {
    const response = await httpClient.get<PaginatedResponse<Color>>(
      ENDPOINTS.COLOR.GET_ALL,
      {
        params: filters,
      }
    );
    return response;
  }

  static async getAllColors(): Promise<ApiResponse<Color[]>> {
    const response = await httpClient.get<Color[]>(ENDPOINTS.COLOR.GET_ALL_COLORS);
    return response;
  }

  static async getColorById(id: string): Promise<ApiResponse<Color>> {
    const response = await httpClient.get<Color>(
      ENDPOINTS.COLOR.GET_BY_ID.replace(":id", id)
    );
    return response;
  }

  static async createColor(data: CreateColorRequest): Promise<ApiResponse<Color>> {
    const response = await httpClient.post<Color>(ENDPOINTS.COLOR.CREATE, data);
    return response;
  }

  static async updateColor(
    id: string,
    data: UpdateColorRequest
  ): Promise<ApiResponse<Color>> {
    const response = await httpClient.put<Color>(
      ENDPOINTS.COLOR.UPDATE.replace(":id", id),
      data
    );
    return response;
  }

  static async deleteColor(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.COLOR.DELETE.replace(":id", id));
    return response;
  }

  static async bulkDeleteColors(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.COLOR.BULK_DELETE, { ids });
    return response;
  }
}

export default ColorService;
