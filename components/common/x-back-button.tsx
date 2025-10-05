"use client";

import { CornerUpLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { XButton } from "@/components/common";

interface XBackButtonProps {
  text?: string;
  href?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function XBackButton({
  text = "Back to home page",
  href,
  className = "inline-flex items-center justify-center gap-2 !bg-transparent hover:text-destructive",
  variant = "ghost",
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
    <XButton variant={variant} onClick={handleGoBack} className={className}>
      <CornerUpLeft />
      {text}
    </XButton>
  );
}
