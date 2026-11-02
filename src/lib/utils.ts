import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indonesian number format: dot for thousands, comma for decimals. */
export function formatNumber(n: number, digits = 0) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(n);
}

/** Rp49.000 */
export function formatRupiah(n: number) {
  return "Rp" + formatNumber(n);
}

