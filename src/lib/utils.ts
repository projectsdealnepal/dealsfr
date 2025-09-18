import { CategoryItem } from "@/redux/features/category/types";
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



//flat the category tree

export const flaternCategoriesList = (list: CategoryItem[]): CategoryItem[] => {
  return list.flatMap(cat => {
    const { children, ...rest } = cat
    const current: CategoryItem = { ...rest, children: [] }

    return [current, ...flaternCategoriesList(children || [])]
  })
}
