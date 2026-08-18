// src/shared/api/axios.ts
import Axios from "axios";
import { storage } from "@/shared/lib/storage"; // Используем алиас для @shared/lib/storage
import { CONFIG } from "../config";

// Основной экземпляр Axios для взаимодействия с production/main API
export const api = Axios.create({
  baseURL: CONFIG.API_URL, // URL основного API из .env
  /*headers: {
    "Content-Type": "application/json",
  },*/
  withCredentials: true, // Отправлять куки с запросами
});

// Экземпляр Axios для взаимодействия с тестовым/моковым API
export const testApi = Axios.create({
  baseURL: CONFIG.TEST_API_URL, // URL тестового API из env
  withCredentials: true,
});

// Добавляем интерсепторы к основному экземпляру 'api'
api.interceptors.request.use((config) => {
  const token = storage.get("session_token");
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthEndpoint =
      requestUrl.includes("/login") ||
      requestUrl.includes("/logout") ||
      requestUrl.includes("/domain-list");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      storage.remove("session_token");
      storage.remove("auth_domain");
      storage.remove("username");
      storage.remove("auth_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"; // Перенаправление на страницу входа при 401
      }
    }
    return Promise.reject(error);
  },
);

testApi.interceptors.request.use((config) => {
  const token = storage.get("session_token");
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

testApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthEndpoint =
      requestUrl.includes("/login") ||
      requestUrl.includes("/logout") ||
      requestUrl.includes("/domain-list");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      storage.remove("session_token");
      storage.remove("auth_domain");
      storage.remove("username");
      storage.remove("auth_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Теперь мы экспортируем оба экземпляра как именованные экспорты.
// Не используем 'export default' здесь, чтобы избежать конфликтов при именованных импортах.

//export default axios;
