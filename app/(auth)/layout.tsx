import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Livinndecoration",
  description: "System login page for Livinndecoration",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
