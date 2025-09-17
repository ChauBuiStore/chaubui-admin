import { LoginPage } from "@/modules/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPageRoot() {
  return <LoginPage />;
}
