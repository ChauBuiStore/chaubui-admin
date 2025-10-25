import { Metadata } from "next";

import { MenusPage } from "@/modules/menu/pages";

export const metadata: Metadata = {
  title: "Menu",
  description: "Manage menu",
};

export default function MenuPage() {
  return <MenusPage />;
}
