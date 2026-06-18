import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind sinflarini xavfsiz birlashtiradi (shartli + konflikt yechish).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Narxni o'zbekcha so'm formatida ko'rsatadi. Narx tiyin emas, butun so'mda saqlanadi.
 * Masalan: 199000 -> "199 000 so'm"
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU").replace(/,/g, " ")} so'm`;
}

/**
 * Katta sonlarni qisqartiradi (like/views uchun): 1500 -> "1.5K"
 */
export function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
