import { Metadata } from "next";

import { CategoriesGroupPage } from "@/modules/category-group/pages";

export const metadata: Metadata = {
  title: "Categories Group",
  description: "Manage product category groups",
};

export default function CategoriesGroupPageRoot() {
  return <CategoriesGroupPage />;
}
