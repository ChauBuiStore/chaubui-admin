import { XBreadcrumb, XSeparator } from "@/components/common";
import { SidebarTrigger } from "@/components/ui";

export function Header() {
  return (
    <header className="flex h-18 shrink-0 items-center gap-2 border-b px-4 relative z-40">
      <SidebarTrigger className="-ml-1" />
      <XSeparator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <XBreadcrumb />
    </header>
  );
}
