import { ApiErrorResponse } from "@/types/apiError";
import { toast } from "sonner";

export function showApiErrors(error: ApiErrorResponse) {
    error.errors.forEach((err) => {
        toast.error(err.message);
    });
}

export function showApiSuccess(error: ApiErrorResponse) {
    error.errors.forEach((err) => {
        toast.success(err.message);
    });
}


