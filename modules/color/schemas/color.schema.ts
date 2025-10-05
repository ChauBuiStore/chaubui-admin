import { z } from "zod";

export const createColorSchema = z.object({
  nameVi: z
    .string()
    .trim()
    .min(1, "Color nameVi cannot be empty")
    .max(50, "Color nameVi cannot exceed 50 characters")
    .trim(),
  nameEn: z
    .string()
    .trim()
    .min(1, "Color nameEn cannot be empty")
    .max(50, "Color nameEn cannot exceed 50 characters")
    .trim(),
  nameKm: z.string().trim().max(50, "Color nameKm cannot exceed 50 characters").optional(),
  code: z
    .string()
    .min(1, "Color code cannot be empty")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color code must be in valid hex format (#RRGGBB)")
    .transform((val) => val.toUpperCase()),
});

export const updateColorSchema = z.object({
  nameVi: z
    .string()
    .trim()
    .min(1, "Color nameVi cannot be empty")
    .max(50, "Color nameVi cannot exceed 50 characters")
    .trim(),
  nameEn: z
    .string()
    .trim()
    .min(1, "Color nameEn cannot be empty")
    .max(50, "Color nameEn cannot exceed 50 characters")
    .trim(),
  nameKm: z.string().trim().max(50, "Color nameKm cannot exceed 50 characters").optional(),
  code: z
    .string()
    .min(1, "Color code cannot be empty")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color code must be in valid hex format (#RRGGBB)")
    .transform((val) => val.toUpperCase()),
});
