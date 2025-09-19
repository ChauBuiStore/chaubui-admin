import { ENDPOINTS, httpClient } from "@/lib/configs";
import { PaginatedResponse, ApiResponse } from "@/lib/types";
import {
  Product,
  ProductFilters,
  CreateProductData,
  UpdateProductData,
} from "@/modules/product/types";

class ProductService {
  static async getProducts(
    filters?: ProductFilters
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const response = await httpClient.get<PaginatedResponse<Product>>(
      ENDPOINTS.PRODUCT.GET_ALL,
      {
        params: filters,
      }
    );
    return response;
  }

  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await httpClient.get<Product>(
      ENDPOINTS.PRODUCT.GET_BY_ID.replace(":id", id)
    );
    return response;
  }

  static async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    const response = await httpClient.post<Product>(
      ENDPOINTS.PRODUCT.CREATE,
      data
    );
    return response;
  }

  static async updateProduct(
    id: string,
    data: UpdateProductData
  ): Promise<ApiResponse<Product>> {
    const response = await httpClient.put<Product>(
      ENDPOINTS.PRODUCT.UPDATE.replace(":id", id),
      data
    );
    return response;
  }

  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.PRODUCT.DELETE.replace(":id", id));
    return response;
  }

  static async bulkDeleteProducts(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.PRODUCT.BULK_DELETE, { ids });
    return response;
  }
}

export default ProductService;
