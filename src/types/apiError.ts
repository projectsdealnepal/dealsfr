
export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  errors: FieldError[];
}
