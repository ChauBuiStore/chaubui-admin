import { Metadata } from "next";

import { CategoriesPage } from "@/modules/category";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage categories",
};

export default function CategoriesPageRoot() {
  return <CategoriesPage />;
}
