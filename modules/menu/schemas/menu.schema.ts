import { z } from "zod";

export const createMenuSchema = z.object({
  nameVi: z
    .string()
    .min(1, "Menu nameVi cannot be empty")
    .max(100, "Menu nameVi cannot exceed 100 characters")
    .trim(),
  nameEn: z
    .string()
    .min(1, "Menu nameEn cannot be empty")
    .max(100, "Menu nameEn cannot exceed 100 characters")
    .trim(),
  nameKm: z.string().trim().optional(),
});

export const updateMenuSchema = z.object({
  nameVi: z
    .string()
    .min(1, "Menu nameVi cannot be empty")
    .max(100, "Menu nameVi cannot exceed 100 characters")
    .trim(),
  nameEn: z
    .string()
    .min(1, "Menu nameEn cannot be empty")
    .max(100, "Menu nameEn cannot exceed 100 characters")
    .trim(),
  nameKm: z.string().trim().optional(),
});
