import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import { CreateMenuData, Menu, MenuFilters, UpdateMenuData } from "@/modules/menu/types/menu.type";

export const menuService = {
  getMenus: async (filters?: MenuFilters): Promise<ApiResponse<Menu[]>> => {
    const response = await authFetcher.get<Menu[]>(ENDPOINTS.MENU.GET_ALL, {
      params: filters,
    });
    return response;
  },

  getMenuById: async (id: string): Promise<ApiResponse<Menu>> => {
    const response = await authFetcher.get<Menu>(ENDPOINTS.MENU.GET_BY_ID.replace(":id", id));
    return response;
  },

  createMenu: async (data: CreateMenuData): Promise<ApiResponse<Menu>> => {
    const response = await authFetcher.post<Menu>(ENDPOINTS.MENU.CREATE, data);
    return response;
  },

  updateMenu: async (id: string, data: UpdateMenuData): Promise<ApiResponse<Menu>> => {
    const response = await authFetcher.put<Menu>(ENDPOINTS.MENU.UPDATE.replace(":id", id), data);
    return response;
  },

  deleteMenu: async (id: string): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.MENU.DELETE.replace(":id", id));
    return response;
  },

  bulkDeleteMenus: async (ids: string[]): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.MENU.BULK_DELETE, { ids });
    return response;
  },
};
