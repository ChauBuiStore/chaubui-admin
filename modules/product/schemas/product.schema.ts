import { z } from "zod";

export const productColorSchema = z.object({
  id: z.string().min(1, "Please select a color"),
  originPrice: z.number().min(0, "Base price must be greater than or equal to 0"),
  salePrice: z.number().min(0, "Sale price must be greater than or equal to 0").nullable().optional(),
  discountPercent: z.number().min(0).max(100, "Discount percentage must be between 0-100").nullable().optional(),
  stock: z.number().min(0, "Stock quantity must be greater than or equal to 0"),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0, "Product price must be greater than or equal to 0"),
  categoryId: z.string().min(1, "Please select a category"),
  colors: z.array(productColorSchema).min(1, "Please add at least one color"),
});

export const updateProductSchema = createProductSchema;

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type ProductColorFormData = z.infer<typeof productColorSchema>;
