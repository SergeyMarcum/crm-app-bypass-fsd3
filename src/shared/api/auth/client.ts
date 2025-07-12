// src/shared/api/client.ts
import axios from "../axios"; // Используется твой общий настроенный инстанс

import { Credentials } from "@features/auth/types";
import { AuthResponse } from "@features/auth/types";

export const authApi = {
  /**
   * Выполняет вход пользователя в систему.
   * @param credentials - Учетные данные пользователя (username, password, domain).
   * @returns Promise<AuthResponse> - Объект, содержащий токен и данные пользователя.
   */
  login: async (credentials: Credentials): Promise<AuthResponse> => {
    const { username, password, domain } = credentials;
    const response = await axios.post("/login", { username, password, domain });
    return response.data;
  },

   /**
   * Выполняет выход пользователя из системы.
   * @returns Promise<void>
   */
  logout: async (): Promise<void> => {    
    await axios.get("/logout");
  },

  /**
   * Проверяет текущую сессию аутентификации.
   * (Примечание: если бэкенд не возвращает AuthResponse, а только статус,
   * то тип возвращаемого значения и логика в store.ts могут потребовать корректировки).
   * @returns Promise<AuthResponse>
   */
  checkAuth: async (): Promise<AuthResponse> => {
    const response = await axios.get("/check-auth");
    return response.data;
  },

  /**
   * Получает список доступных доменов.
   * @returns Promise<Record<string, string>> - Объект, где ключ - ID домена, значение - название домена.
   */
  getDomainList: async (): Promise<Record<string, string>> => {
    const response = await axios.get("/domain-list");
    return response.data;
  },
};
