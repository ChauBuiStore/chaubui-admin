import { Metadata } from "next";

import { LoginPage } from "@/modules/auth/pages";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPageRoot() {
  return <LoginPage />;
}
