import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function capitalize(word: string) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const extractErrorMessage = (error: any, defaultMessage = "Something went wrong") => {
  if (error?.response?.data) {
    // Adjust this mapping once if backend response structure changes
    return (
      error.response.data?.errors?.[0]?.message ||
      error.response.data?.message ||
      error.response.data?.error ||
      defaultMessage
    );
  }

  return error?.message || defaultMessage;
};
