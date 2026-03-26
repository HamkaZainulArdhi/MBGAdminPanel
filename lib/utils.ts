import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date string in dd-MM-yyyy format to readable format
 * e.g., "25-03-2026" → "25 Mar 2026"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "—") return "—";

  try {
    const [day, month, year] = dateStr.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format ISO datetime string to readable format
 * e.g., "2026-03-25T16:00:55Z" → "25 Mar 2026 pukul 16:00"
 */
export function formatDatetimeReadable(datetime: string): string {
  if (!datetime) return "—";

  try {
    const date = new Date(datetime);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return datetime;
  }
}
