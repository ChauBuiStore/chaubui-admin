import { CategoriesGroupPage } from "@/modules/category-group/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories Group",
  description: "Manage product category groups",
};

export default function CategoriesGroupPageRoot() {
  return <CategoriesGroupPage />;
}
