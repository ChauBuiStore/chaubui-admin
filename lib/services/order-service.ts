import { authFetcher, ENDPOINTS } from "@/lib/configs";
import { ApiResponse } from "@/lib/types";
import { Order, UpdateOrderStatusRequest } from "@/modules/order/types/order.type";

export type OrderFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: Order["status"];
};

export const orderService = {
  getOrders: async (filters?: OrderFilters): Promise<ApiResponse<Order[]>> => {
    const response = await authFetcher.get<Order[]>(ENDPOINTS.ORDER.GET_ALL, {
      params: filters,
    });
    return response;
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await authFetcher.get<Order>(ENDPOINTS.ORDER.GET_BY_ID.replace(":id", id));
    return response;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<ApiResponse<void>> => {
    const response = await authFetcher.patch<void>(ENDPOINTS.ORDER.UPDATE.replace(":id", id), data);
    return response;
  },
};
