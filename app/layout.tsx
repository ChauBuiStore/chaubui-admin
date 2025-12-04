import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui";
import { AuthProvider } from "@/lib/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livinndecoration",
  description: "Product management application for Livinndecoration",
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
