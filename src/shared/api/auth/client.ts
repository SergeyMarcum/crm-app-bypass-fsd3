// src/shared/api/client.ts
import axios from "../axios"; // Используется твой общий настроенный инстанс

import { Credentials } from "@features/auth/types";
import { AuthResponse } from "@features/auth/types";

export const authApi = {
  login: async (credentials: Credentials): Promise<AuthResponse> => {
    const { username, password, domain } = credentials;
    const response = await axios.post("/login", { username, password, domain });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post("/logout");
  },

  checkAuth: async (): Promise<AuthResponse> => {
    const response = await axios.get("/check-auth");
    return response.data;
  },

  getDomainList: async (): Promise<Record<string, string>> => {
    const response = await axios.get("/domain-list");
    return response.data;
  },
};
