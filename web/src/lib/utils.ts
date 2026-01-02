import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "CNY") {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseImageUrls(value: string | null | undefined) {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed.filter((v) => typeof v === "string") as string[]) : [];
  } catch {
    return [] as string[];
  }
}
