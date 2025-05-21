import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
 return new Date(date).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
 });
}

export function copyToClipboard(text: string): Promise<void> {
 return navigator.clipboard.writeText(text);
}
