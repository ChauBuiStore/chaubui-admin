import { z } from "zod";

export const createColorSchema = z.object({
  name: z
    .string()
    .min(1, "Color name cannot be empty")
    .max(50, "Color name cannot exceed 50 characters")
    .trim(),
  code: z
    .string()
    .min(1, "Color code cannot be empty")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color code must be in valid hex format (#RRGGBB)")
    .transform((val) => val.toUpperCase()),
});

export const updateColorSchema = z.object({
  name: z
    .string()
    .min(1, "Color name cannot be empty")
    .max(50, "Color name cannot exceed 50 characters")
    .trim(),
  code: z
    .string()
    .min(1, "Color code cannot be empty")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color code must be in valid hex format (#RRGGBB)")
    .transform((val) => val.toUpperCase()),
});
