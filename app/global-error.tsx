"use client";

import { useEffect } from "react";

import { XBackButton } from "@/components/common";
import { ROUTES } from "@/lib/constants";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Something went wrong!</h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try again or contact support if the problem
                persists.
              </p>
            </div>
            <XBackButton href={ROUTES.DASHBOARD} />
          </div>
        </div>
      </body>
    </html>
  );
}

