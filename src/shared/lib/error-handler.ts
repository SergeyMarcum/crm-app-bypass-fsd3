// src/shared/lib/error-handler.ts
import { toast } from "react-toastify";

export const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "An error occurred";
  toast.error(message);
};
