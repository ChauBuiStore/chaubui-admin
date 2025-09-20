import { ENDPOINTS, httpClient } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import {
  CreateMenuData,
  Menu,
  MenuFilters,
  UpdateMenuData,
} from "@/modules/menu/types";

class MenuService {
  static async getMenus(
    filters?: MenuFilters
  ): Promise<ApiResponse<Menu[]>> {
    const response = await httpClient.get<Menu[]>(
      ENDPOINTS.MENU.GET_ALL,
      {
        params: filters,
      }
    );
    return response;
  }

  static async getMenuById(id: string): Promise<ApiResponse<Menu>> {
    const response = await httpClient.get<Menu>(
      ENDPOINTS.MENU.GET_BY_ID.replace(":id", id)
    );
    return response;
  }

  static async createMenu(data: CreateMenuData): Promise<ApiResponse<Menu>> {
    const response = await httpClient.post<Menu>(ENDPOINTS.MENU.CREATE, data);
    return response;
  }

  static async updateMenu(id: string, data: UpdateMenuData): Promise<ApiResponse<Menu>> {
    const response = await httpClient.put<Menu>(
      ENDPOINTS.MENU.UPDATE.replace(":id", id),
      data
    );
    return response;
  }

  static async deleteMenu(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.MENU.DELETE.replace(":id", id));
    return response;
  }

  static async bulkDeleteMenus(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.MENU.BULK_DELETE, { ids });
    return response;
  }
}

export default MenuService;
