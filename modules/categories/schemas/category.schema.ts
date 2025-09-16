import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category description is required"),
  groupId: z.string().min(1, "Category group is required"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category description is required"),
  groupId: z.string().min(1, "Category group is required"),
});
