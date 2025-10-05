import { Metadata } from "next";

import { ColorsPage } from "@/modules/color";

export const metadata: Metadata = {
  title: "Colors",
  description: "Manage colors",
};

export default function ColorsPageRoot() {
  return <ColorsPage />;
}
