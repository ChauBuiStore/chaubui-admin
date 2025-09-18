import { ENDPOINTS, httpClient } from "@/lib/configs";
import { PaginatedResponse } from "@/lib/types";
import {
  Color,
  ColorFilters,
  CreateColorRequest,
  UpdateColorRequest,
} from "@/modules/colors/types";

class ColorService {
  static async getColors(
    filters?: ColorFilters
  ): Promise<PaginatedResponse<Color>> {
    const response = await httpClient.get<PaginatedResponse<Color>>(
      ENDPOINTS.COLOR.GET_ALL,
      {
        params: filters,
      }
    );
    return response.data;
  }

  static async getColorById(id: string): Promise<Color> {
    const response = await httpClient.get<Color>(
      ENDPOINTS.COLOR.GET_BY_ID.replace(":id", id)
    );
    return response.data;
  }

  static async createColor(data: CreateColorRequest): Promise<Color> {
    const response = await httpClient.post<Color>(ENDPOINTS.COLOR.CREATE, data);
    return response.data;
  }

  static async updateColor(
    id: string,
    data: UpdateColorRequest
  ): Promise<Color> {
    const response = await httpClient.put<Color>(
      ENDPOINTS.COLOR.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  }

  static async deleteColor(id: string): Promise<void> {
    await httpClient.delete<void>(ENDPOINTS.COLOR.DELETE.replace(":id", id));
  }

  static async bulkDeleteColors(ids: string[]): Promise<void> {
    await httpClient.delete<void>(ENDPOINTS.COLOR.BULK_DELETE, { ids });
  }
}

export default ColorService;
