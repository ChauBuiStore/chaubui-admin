import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - My App",
  description: "System login page",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
