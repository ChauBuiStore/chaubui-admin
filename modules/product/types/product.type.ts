import { Category } from "@/modules/category/types";
import { Color } from "@/modules/color/types";
import { ProductImage } from "./product-image.type";
import { ProductVariant, ProductVariantData, VariantType } from "./product-variant.type";


export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  colors: Color[];
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  variantType: VariantType;
  images?: ProductImage[];
  variants?: ProductVariantData[];
}

export interface UpdateProductData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  variantType: VariantType;
  images?: ProductImage[];
  variants?: ProductVariantData[];
}

export interface ProductFilters extends Record<string, unknown> {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
