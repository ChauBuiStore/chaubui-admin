import { Category } from "@/modules/category/types";
import { Color } from "@/modules/color/types";

export interface Variant {
  id: string;
  color: Color;
  stock: number;
  discountPercent: number;
  originalPrice: number;
  salePrice: number;
  sku: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  colors: Color[];
  variants: Variant[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  colors: Color[];
}

export interface UpdateProductData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  colors: Color[];
}

export interface ProductFilters extends Record<string, unknown> {
  search?: string;
  categoryId?: string | null;
  page?: string | number;
  limit?: string | number;
}
