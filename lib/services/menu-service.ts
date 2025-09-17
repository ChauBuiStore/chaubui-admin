import { ENDPOINTS } from "@/lib/configs";
import { httpClient } from "@/lib/configs/http-client";
import { PaginatedResponse } from "@/lib/types";
import {
  CreateMenuData,
  Menu,
  MenuFilters,
  UpdateMenuData,
} from "@/modules/menu";

export class MenuService {
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
    const response = await httpClient.post<Menu>(
      ENDPOINTS.MENU.CREATE,
      data
    );
    return response.data;
  }

  static async updateMenu(
    id: string,
    data: UpdateMenuData
  ): Promise<Menu> {
    const response = await httpClient.put<Menu>(
      ENDPOINTS.MENU.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  }

  static async deleteMenu(id: string): Promise<void> {
    await httpClient.delete<void>(
      ENDPOINTS.MENU.DELETE.replace(":id", id)
    );
  }

  static async bulkDeleteMenus(
    ids: string[]
  ): Promise<{ success: boolean; data: unknown }> {
    const response = await httpClient.post<{ success: boolean; data: unknown }>(
      ENDPOINTS.MENU.BULK_DELETE,
      { ids }
    );
    return response.data;
  }

  static async togglePublicMenu(id: string): Promise<Menu> {
    const response = await httpClient.patch<Menu>(
      ENDPOINTS.MENU.TOGGLE_PUBLIC.replace(":id", id),
    );
    return response.data;
  }
}
