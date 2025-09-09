import clsx from "clsx"
import { twMerge } from "tailwind-merge"

type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
