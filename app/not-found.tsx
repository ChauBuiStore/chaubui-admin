import { XBackButton } from "@/components/common";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        Page Not Found
      </h1>
      <p className="text-muted-foreground mb-6">Sorry, we couldn&apos;t find this page</p>
      <XBackButton href={ROUTES.DASHBOARD} />
      <div
        className="w-[80px] h-1 mt-[30px] bg-primary"
        aria-hidden="true"
      />
    </div>
  );
}
