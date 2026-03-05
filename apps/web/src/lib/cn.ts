import { cn as tvCn } from "tailwind-variants";

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]) {
  return tvCn(...classes);
}
