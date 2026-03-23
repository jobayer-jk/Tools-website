import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge.
 * This prevents Tailwind class conflicts by intelligently merging classes.
 *
 * @param inputs - Any number of class values (strings, arrays, objects)
 * @returns A single merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
