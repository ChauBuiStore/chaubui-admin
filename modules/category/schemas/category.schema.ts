import { z } from "zod";

export const createCategorySchema = z.object({
  nameVi: z.string().trim().min(1, "Category nameVi is required"),
  nameEn: z.string().trim().min(1, "Category nameEn is required"),
  nameKm: z.string().trim().optional(),
  groupId: z.string().min(1, "Category group is required"),
});

export const updateCategorySchema = z.object({
  nameVi: z.string().trim().min(1, "Category nameVi is required"),
  nameEn: z.string().trim().min(1, "Category nameEn is required"),
  nameKm: z.string().trim().optional(),
  groupId: z.string().min(1, "Category group is required"),
});
