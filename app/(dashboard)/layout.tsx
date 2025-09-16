import { AuthGuard } from "@/components/auth/auth-guard";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar, Header } from "@/components/layout";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthGuard>
        <div className="flex h-screen bg-gray-50">
          <SidebarProvider>
            <Sidebar />
            <SidebarInset>
              <Header />
              <div className="p-6">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </AuthGuard>
    </Suspense>
  );
}
