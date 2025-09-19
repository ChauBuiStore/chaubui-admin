import { CategoriesPage } from "@/modules/category";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage categories",
};

export default function CategoriesPageRoot() {
  return (
    <CategoriesPage />
  ); 
}
