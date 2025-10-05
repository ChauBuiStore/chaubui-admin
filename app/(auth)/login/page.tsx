import { Metadata } from "next";

import { LoginPage } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPageRoot() {
  return <LoginPage />;
}
