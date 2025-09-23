import { z } from "zod";
import { VariantType } from "../types/product-variant.type";

export const productImageSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
  alt: z.string().min(1, "Image alt text is required"),
  sortOrder: z.number().min(1, "Sort order must be at least 1"),
  isThumbnail: z.boolean(),
});

export const productVariantSchema = z.object({
  sizeId: z.string().optional(),
  colorId: z.string().optional(),
  originalPrice: z.number().min(0, "Original price must be greater than or equal to 0").optional(),
  salePrice: z.number().min(0, "Sale price must be greater than or equal to 0").optional(),
  discountPercent: z.number().min(0).max(100, "Discount percentage must be between 0-100").optional(),
  stock: z.number().min(0, "Stock quantity must be greater than or equal to 0").optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0, "Product price must be greater than or equal to 0").optional(),
  categoryId: z.string().min(1, "Please select a category"),
  variantType: z.nativeEnum(VariantType, {
    message: "Please select a variant type"
  }),
  images: z.array(productImageSchema).optional(),
  variants: z.array(productVariantSchema).optional().default([]),
}).superRefine((data, ctx) => {
  if (data.variantType === VariantType.NONE) {
    return;
  }

  if (!data.variants || data.variants.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please add at least one variant",
      path: ["variants"]
    });
    return;
  }

  for (let i = 0; i < data.variants.length; i++) {
    const variant = data.variants[i];

    if (data.variantType === VariantType.COLOR || data.variantType === VariantType.COMBO) {
      if (!variant.colorId || variant.colorId.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a color",
          path: ["variants", i, "colorId"]
        });
      }
    }

    if (data.variantType === VariantType.SIZE || data.variantType === VariantType.COMBO) {
      if (!variant.sizeId || variant.sizeId.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a size",
          path: ["variants", i, "sizeId"]
        });
      }
    }
  }
});

export const updateProductSchema = createProductSchema;

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type ProductImageFormData = z.infer<typeof productImageSchema>;
export type ProductVariantFormData = z.infer<typeof productVariantSchema>;