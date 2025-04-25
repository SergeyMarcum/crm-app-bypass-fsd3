// src/shared/api/axios.ts
import Axios from "axios";
import { storage } from "../lib/storage";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axios.interceptors.request.use((config) => {
  const token = storage.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove("auth_token");
      storage.remove("auth_user");
      storage.remove("auth_domain");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
