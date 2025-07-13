// src/shared/api/axios.ts
import Axios from "axios";
import { storage } from "@/shared/lib/storage"; // Используем алиас для @shared/lib/storage

// Основной экземпляр Axios для взаимодействия с production/main API
export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL основного API из .env
  withCredentials: true, // Отправлять куки с запросами
});

// Экземпляр Axios для взаимодействия с тестовым/моковым API
export const testApi = Axios.create({
  baseURL: import.meta.env.VITE_TEST_API_URL || "http://localhost:3001", // URL тестового API из .env или fallback
  withCredentials: true,
});

// Добавляем интерсепторы к основному экземпляру 'api'
api.interceptors.request.use((config) => {
  const token = storage.get("session_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove("session_token");
      storage.remove("auth_domain");
      storage.remove("username");
      storage.remove("auth_user");
      window.location.href = "/login"; // Перенаправление на страницу входа при 401
    }
    return Promise.reject(error);
  }
);

// Для 'testApi' интерсепторы могут быть добавлены аналогично, если это требуется.
// В данном случае, мы не добавляем их, предполагая, что 'testApi' может не требовать токенов или перенаправлений.
// Если 'testApi' также нуждается в этих интерсепторах, их нужно добавить сюда.
testApi.interceptors.request.use((config) => {
  const token = storage.get("session_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

testApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Для testApi можно настроить другое поведение при 401,
    // или оставить такое же, если мок-сервер имитирует то же поведение
    if (error.response?.status === 401) {
      storage.remove("session_token");
      storage.remove("auth_domain");
      storage.remove("username");
      storage.remove("auth_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Теперь мы экспортируем оба экземпляра как именованные экспорты.
// Не используем 'export default' здесь, чтобы избежать конфликтов при именованных импортах.

//export default axios;
