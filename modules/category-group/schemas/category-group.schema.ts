import { z } from "zod";

export const createCategoryGroupSchema = z.object({
  nameVi: z.string().trim().min(1, "Category nameVi is required"),
  nameEn: z.string().trim().min(1, "Category nameEn is required"),
  nameKm: z.string().trim().optional(),
});

export const updateCategoryGroupSchema = z.object({
  nameVi: z.string().trim().min(1, "Category nameVi is required"),
  nameEn: z.string().trim().min(1, "Category nameEn is required"),
  nameKm: z.string().trim().optional(),
});
