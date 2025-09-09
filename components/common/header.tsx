import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Breadcrumb } from "../ui/breadcrumb";
import { BreadcrumbList } from "../ui/breadcrumb";
import { BreadcrumbItem } from "../ui/breadcrumb";
import { BreadcrumbLink } from "../ui/breadcrumb";
import { BreadcrumbSeparator } from "../ui/breadcrumb";
import { BreadcrumbPage } from "../ui/breadcrumb";

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
