import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { QueryProvider } from "@/lib/query-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App",
  description: "Product management application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton expand={true} duration={4000} />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
