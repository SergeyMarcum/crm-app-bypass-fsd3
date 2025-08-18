// src/shared/api/auth/client.ts

import { api } from "../axios"; // Теперь импортируем именованный экспорт 'api'

import { Credentials } from "@/features/auth/types"; // Используем алиас
import { AuthResponse } from "@/features/auth/types"; // Используем алиас

export const authApi = {
  /**
   * Выполняет вход пользователя в систему.
   * @param credentials - Учетные данные пользователя (username, password, domain).
   * @returns Promise<AuthResponse> - Объект, содержащий токен и данные пользователя.
   */
  login: async (credentials: Credentials): Promise<AuthResponse> => {
    const { username, password, domain } = credentials;
    const response = await api.post("/login", { username, password, domain });
    return response.data;
  },

  /**
   * Выполняет выход пользователя из системы.
   * @returns Promise<void>
   */
  logout: async (): Promise<void> => {
    await api.get("/logout");
  },

  /**
   * Проверяет текущую сессию аутентификации.
   * (Примечание: если бэкенд не возвращает AuthResponse, а только статус,
   * то тип возвращаемого значения и логика в store.ts могут потребовать корректировки).
   * @returns Promise<AuthResponse>
   */
  checkAuth: async (): Promise<AuthResponse> => {
    const response = await api.get("/check-auth");
    return response.data;
  },

  /**
   * Получает список доступных доменов.
   * @returns Promise<Record<string, string>> - Объект, где ключ - ID домена, значение - название домена.
   */
  getDomainList: async (): Promise<Record<string, string>> => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axios'
    const response = await api.get("/domain-list");
    return response.data;
  },
};
