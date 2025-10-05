import { Suspense } from "react";

import { Header, Sidebar } from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen bg-muted">
        <SidebarProvider>
          <Sidebar />
          <SidebarInset>
            <Header />
            <div className="p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </Suspense>
  );
}
