// src/shared/api/auth/client.ts
import axios from "../axios";
import { AuthResponse, Credentials } from "@features/auth/types";

export const authApi = {
  getDomainList: async (): Promise<Record<string, string>> => {
    console.log("Получение списка доменов");
    const response = await axios.get("/domain-list");
    console.log("Domain list response:", response.data);
    return response.data;
  },

  login: async (credentials: Credentials): Promise<AuthResponse> => {
    console.log("Отправка запроса на вход в систему:", credentials);
    const response = await axios.post("/login", {
      username: credentials.username,
      password: credentials.password,
      domain: credentials.domain,
    });
    console.log("Необработанный ответ API входа в систему:", response.data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.get("/logout");
  },

  checkSession: async (params: {
    domain: string;
    username: string;
    session_code: string;
  }): Promise<void> => {
    await axios.get("/check-session", { params });
  },
};
