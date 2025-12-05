import { Header, Sidebar } from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-muted">
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <Header />
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <div className="p-6">{children}</div>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
