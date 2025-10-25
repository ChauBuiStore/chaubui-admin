import { Category } from "@/modules/category/types/category.type";
import { Color } from "@/modules/color/types/color.type";
import { Size } from "@/modules/size/types/size.type";

import { ProductImage } from "./product-image.type";
import { ProductVariant, ProductVariantData, VariantType } from "./product-variant.type";

export interface Product {
  id: string;
  name: string;
  nameVi: string;
  nameEn: string;
  nameKm?: string;
  slug: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  discountPercent: number;
  category: Category;
  colors: Color[];
  sizes: Size[];
  variantType: VariantType;
  variants: ProductVariant[];
  images: ProductImage[];
  thumbnail?: ProductImage[];
  thumbnailId?: string;
  thumbnailUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateProductData {
  nameVi: string;
  nameEn: string;
  nameKm?: string;
  description: string;
  originalPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  stock?: number;
  categoryId: string;
  variantType: VariantType;
  thumbnailUrl?: string;
  thumbnailId?: string;
  images?: ProductImage[];
  variants?: ProductVariantData[];
}

export interface UpdateProductData {
  nameVi: string;
  nameEn: string;
  nameKm?: string;
  description: string;
  originalPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  stock?: number;
  categoryId: string;
  variantType: VariantType;
  thumbnailUrl?: string;
  thumbnailId?: string;
  images?: ProductImage[];
  variants?: ProductVariantData[];
}

export interface ProductFilters extends Record<string, unknown> {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
