// src/shared/lib/error-handler.ts
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { toast } from "react-toastify";

type HandlerOptions = {
  silent?: boolean; // не показывать toast
  log?: boolean; // логировать в консоль
  toastDuration?: number;
  fallbackMessage?: string;
};

export function handleApiError(
  error: unknown,
  options: HandlerOptions = {}
): string {
  const {
    silent = false,
    log = true,
    toastDuration = 4000,
    fallbackMessage = "Произошла непредвиденная ошибка. Попробуйте позже.",
  } = options;

  let message = fallbackMessage;

  // --- Axios error ---
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      fallbackMessage;

    if (axiosError.code === "ERR_NETWORK") {
      message =
        "Нет подключения к серверу. Проверьте интернет или настройки CORS.";
    }
  }

  // --- Zod validation error ---
  else if (error instanceof ZodError) {
    message = error.issues.map((i) => i.message).join("\n");
  }

  // --- Native JS error ---
  else if (error instanceof Error) {
    message = error.message || fallbackMessage;
  }

  // --- Unknown structure ---
  else if (typeof error === "string") {
    message = error;
  }

  // Logging (optional)
  if (log) {
    console.error("[API ERROR]:", error);
  }

  // Toast (optional)
  if (!silent) {
    toast.error(message, { autoClose: toastDuration });
  }

  return message;
}
