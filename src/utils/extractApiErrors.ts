
import axios from "axios";
import type { ApiErrorResponse } from "@/types/apiError";

export function extractApiErrors(error: unknown): ApiErrorResponse {
  // Axios error with backend response
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // Case 1: Your backend format
    if (data?.errors && Array.isArray(data.errors)) {
      return {
        errors: data.errors.map((err: any) => ({
          field: err.field ?? "general",
          message: err.message ?? "Something went wrong",
        })),
      };
    }

    // Case 2: Axios error but unexpected backend shape
    return {
      errors: [
        {
          field: "general",
          message:
            data?.message ||
            error.message ||
            "Request failed",
        },
      ],
    };
  }

  // Case 3: Non-Axios / unknown error
  if (error instanceof Error) {
    return {
      errors: [
        {
          field: "general",
          message: error.message,
        },
      ],
    };
  }

  // Case 4: Absolute fallback
  return {
    errors: [
      {
        field: "general",
        message: "An unknown error occurred",
      },
    ],
  };
}
