import { Color } from "@/modules/color/types/color.type";
import { Size } from "@/modules/size/types/size.type";

export enum VariantType {
  COLOR = "COLOR",
  SIZE = "SIZE",
  COMBO = "COMBO",
  NONE = "NONE",
}

export interface ProductVariant {
  id: string;
  size: Size;
  color: Color;
  stock: number;
  originalPrice: number;
  discountPercent?: number;
  salePrice?: number;
}

export interface ProductVariantData {
  sizeId?: string;
  colorId?: string;
  stock?: number;
  originalPrice?: number;
  discountPercent?: number;
  salePrice?: number;
}
