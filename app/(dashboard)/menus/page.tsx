import { MenusPage } from "@/modules/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Manage menu",
};

export default function MenuPage() {
  return <MenusPage />;
}
