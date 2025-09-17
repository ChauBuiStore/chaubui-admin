"use client";

import { Button } from "@/components/ui/button";
import { CornerUpLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface XBackButtonProps {
  text?: string;
  href?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function XBackButton({ 
  text = "Back to home page", 
  href, 
  className = "inline-flex items-center justify-center gap-2 !bg-transparent hover:text-red-500",
  variant = "ghost"
}: XBackButtonProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleGoBack}
      className={className}
    >
      <CornerUpLeft  />
      {text}
    </Button>
  );
}
