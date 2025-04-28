// src/shared/api/client.ts
import axios from "../axios";

interface Credentials {
  username: string;
  password: string;
  domain: string;
  rememberMe?: boolean; // Локальная логика
}

export const authApi = {
  login: async (credentials: Credentials) => {
    const { username, password, domain } = credentials; // Забираем только нужные поля
    const response = await axios.post("/login", { username, password, domain });
    return response.data;
  },
  logout: async () => {
    await axios.post("/logout");
  },
  checkSession: async (
    domain: string,
    username: string,
    session_code: string
  ) => {
    const response = await axios.post("/check-session", {
      domain,
      username,
      session_code,
    });
    return response.data;
  },
  getDomainList: async () => {
    const response = await axios.get("/domain-list");
    return response.data;
  },
  checkAuth: async () => {
    const response = await axios.get("/check-auth");
    return response.data;
  },
};
