import { XBackButton } from "@/components/common";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">

      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Page Not Found
      </h1>
      <p className="text-gray-600 mb-6">Sorry, we couldn&apos;t find this page</p>
      <XBackButton href="/dashboard" />
      <div
        className="w-[80px] h-1 mt-[30px] bg-primary"
        aria-hidden="true"
      />
    </div>
  );
}
