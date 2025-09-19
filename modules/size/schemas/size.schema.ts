import { z } from "zod";

export const createSizeSchema = z.object({
  name: z
    .string()
    .min(1, "Size name cannot be empty")
    .max(100, "Size name cannot exceed 100 characters")
    .trim(),
});

export const updateSizeSchema = z.object({
  name: z
    .string()
    .min(1, "Size name cannot be empty")
    .max(100, "Size name cannot exceed 100 characters")
    .trim(),
});