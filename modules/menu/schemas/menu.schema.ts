import { z } from "zod";

export const createMenuSchema = z.object({
  name: z
    .string()
    .min(1, "Menu name cannot be empty")
    .max(100, "Menu name cannot exceed 100 characters")
    .trim(),
});

export const updateMenuSchema = z.object({
  name: z
    .string()
    .min(1, "Menu name cannot be empty")
    .max(100, "Menu name cannot exceed 100 characters")
    .trim(),
});
