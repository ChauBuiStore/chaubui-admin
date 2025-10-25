import { z } from "zod";

export const createCategoryGroupSchema = z.object({
  nameVi: z.string().trim().min(1, "Category group nameVi is required"),
  nameEn: z.string().trim().min(1, "Category group nameEn is required"),
  nameKm: z.string().trim().optional(),
});

export const updateCategoryGroupSchema = z.object({
  nameVi: z.string().trim().min(1, "Category group nameVi is required"),
  nameEn: z.string().trim().min(1, "Category group nameEn is required"),
  nameKm: z.string().trim().optional(),
});
