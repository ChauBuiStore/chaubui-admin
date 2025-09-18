import { ENDPOINTS, httpClient } from "@/lib/configs";
import { PaginatedResponse } from "@/lib/types";
import {
  CreateMenuData,
  Menu,
  MenuFilters,
  UpdateMenuData,
} from "@/modules/menu/types";

class MenuService {
  static async getMenus(
    filters?: MenuFilters
  ): Promise<PaginatedResponse<Menu>> {
    const response = await httpClient.get<PaginatedResponse<Menu>>(
      ENDPOINTS.MENU.GET_ALL,
      {
        params: filters,
      }
    );
    return response.data;
  }

  static async getMenuById(id: string): Promise<Menu> {
    const response = await httpClient.get<Menu>(
      ENDPOINTS.MENU.GET_BY_ID.replace(":id", id)
    );
    return response.data;
  }

  static async createMenu(data: CreateMenuData): Promise<Menu> {
    const response = await httpClient.post<Menu>(ENDPOINTS.MENU.CREATE, data);
    return response.data;
  }

  static async updateMenu(id: string, data: UpdateMenuData): Promise<Menu> {
    const response = await httpClient.put<Menu>(
      ENDPOINTS.MENU.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  }

  static async deleteMenu(id: string): Promise<void> {
    await httpClient.delete<void>(ENDPOINTS.MENU.DELETE.replace(":id", id));
  }

  static async bulkDeleteMenus(ids: string[]): Promise<void> {
    await httpClient.delete<void>(ENDPOINTS.MENU.BULK_DELETE, { ids });
  }

  static async togglePublicMenu(id: string): Promise<Menu> {
    const response = await httpClient.patch<Menu>(
      ENDPOINTS.MENU.TOGGLE_PUBLIC.replace(":id", id)
    );
    return response.data;
  }
}

export default MenuService;
