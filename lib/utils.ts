import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian Rupiah currency format
 * e.g. 1250000 -> "Rp1.250.000"
 */
export function formatRupiah(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num === null || num === undefined || isNaN(num)) {
    return "Rp0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num).replace(/\s/g, "");
}

/**
 * Format date string to Indonesian formatted date
 * e.g. "2026-11-12" -> "12 Nov 2026"
 */
export function formatIndoDate(dateString: string | Date): string {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Get current month string in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export const CATEGORIES_EXPENSE = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Pendidikan",
  "Hiburan",
  "Tagihan",
  "Kesehatan",
  "Lainnya",
] as const;

export const CATEGORIES_INCOME = [
  "Gaji",
  "Uang Saku",
  "Investasi",
  "Bonus",
  "Penjualan",
  "Lainnya",
] as const;
