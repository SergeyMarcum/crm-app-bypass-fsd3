// src/shared/api/axios.ts
import Axios from "axios";
import { storage } from "@shared/lib/storage";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Установлен baseURL из .env
  withCredentials: true,
});

axios.interceptors.request.use((config) => {
  const token = storage.get("session_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove("session_token");
      storage.remove("auth_domain");
      storage.remove("username"); // Убедимся, что логин пользователя тоже удаляется
      storage.remove("auth_user"); // Убедимся, что объект пользователя тоже удаляется
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
