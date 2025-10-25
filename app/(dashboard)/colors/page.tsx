import { Metadata } from "next";

import { ColorsPage } from "@/modules/color/pages";

export const metadata: Metadata = {
  title: "Colors",
  description: "Manage colors",
};

export default function ColorsPageRoot() {
  return <ColorsPage />;
}
