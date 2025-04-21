// src/shared/api/axios.ts
import Axios from "axios";

export const axios = Axios.create({
  baseURL: "http://192.168.1.248:8082",
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use((config) => {
  const sessionCode = localStorage.getItem("session_code");
  if (sessionCode) {
    config.params = { ...config.params, session_code: sessionCode };
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок
    throw error;
  }
);
