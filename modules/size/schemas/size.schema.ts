import { z } from "zod";

export const createSizeSchema = z.object({
  nameVi: z
    .string()
    .min(1, "Size nameVi is required")
    .max(100, "Size nameVi cannot exceed 100 characters")
    .trim(),
  nameEn: z
    .string()
    .min(1, "Size nameEn is required")
    .max(100, "Size nameEn cannot exceed 100 characters")
    .trim(),
  nameKm: z.string().trim().optional(),
});

export const updateSizeSchema = z.object({
  nameVi: z
    .string()
    .min(1, "Size nameVi is required")
    .max(100, "Size nameVi cannot exceed 100 characters")
    .trim(),
  nameEn: z
    .string()
    .min(1, "Size nameEn is required")
    .max(100, "Size nameEn cannot exceed 100 characters")
    .trim(),
  nameKm: z.string().trim().optional(),
});
