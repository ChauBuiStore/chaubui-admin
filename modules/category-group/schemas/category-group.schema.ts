import { z } from "zod";

export const createCategoryGroupSchema = z.object({
    name: z.string().min(1, "Category name is required"),
  });

export const updateCategoryGroupSchema = z.object({
    name: z.string().min(1, "Category name is required"),
  });