import { ColorsPage } from "@/modules/color";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colors",
  description: "Manage colors",
};

export default function ColorsPageRoot() {
  return <ColorsPage />;
}
