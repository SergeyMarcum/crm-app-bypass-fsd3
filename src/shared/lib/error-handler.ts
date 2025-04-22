// src/shared/lib/error-handler.ts
import { AxiosError } from "axios";

export const handleApiError = (error: AxiosError): string => {
  return error.response?.data?.message || "An unexpected error occurred";
};
