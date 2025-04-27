// src/shared/api/client.ts
import axios from "../axios";

export const authApi = {
  login: async (credentials: {
    username: string;
    password: string;
    domain: string;
    rememberMe: boolean;
  }) => {
    // Временный мок для разработки
    /*if (credentials.username === 'frontend' && credentials.password === '!QAZxsw2!@3') {
      return {
        token: 'mock_token_123',
        user: {
          id: 'user1',
          name: 'Frontend User',
          role_id: 1,
        },
      };
    }*/
    // throw new Error("Неверный логин или пароль");
    // Раскомментируйте для работы с реальным API после настройки CORS
    const response = await axios.post("/login", credentials);
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
    // Мок данных, если используется
    /*return {
      domain1: 'Domain One',
      domain2: 'Domain Two',
      domain3: 'Domain Three',
    };*/
    // Раскомментируйте для работы с реальным API
    const response = await axios.get("/domain-list");
    return response.data;
  },
  checkAuth: async () => {
    const response = await axios.get("/check-auth");
    return response.data;
  },
};
