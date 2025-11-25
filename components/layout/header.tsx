"use client";

import { XBreadcrumb, XSeparator } from "@/components/common";
import { SidebarTrigger } from "@/components/ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex flex-row justify-between h-18 shrink-0 items-center gap-2 border-b px-4 relative z-40">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <XSeparator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <XBreadcrumb />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Avatar>
          <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{user?.fullName}</span>
      </div>
    </header>
  );
}
