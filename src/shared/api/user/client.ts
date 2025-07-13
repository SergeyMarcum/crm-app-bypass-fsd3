// src/shared/api/user/client.ts
// ИСПРАВЛЕНИЕ: Изменен импорт с default на именованный экспорт 'api'
import { api } from "@/shared/api/axios"; // Импортируем именованный экспорт 'api'
import { userSchema, editUserSchema } from "@shared/lib/schemas";
import { EditUserPayload } from "@entities/user/types";
import { z } from "zod";
import { getAuthParams } from "@/shared/lib/auth";
import { storage } from "@/shared/lib/storage";

export const userApi = {
  getCurrentUser: async () => {
    try {
      const userFromStorage = storage.get("auth_user");
      if (userFromStorage) {
        // Парсим сохраненные данные пользователя и валидируем их схемой
        const userData = JSON.parse(userFromStorage);
        return userSchema.parse(userData);
      } else {
        // Если пользовательские данные не найдены в localStorage,
        // выбрасываем ошибку, чтобы сигнализировать об отсутствии авторизации.
        throw new Error("User data not found in local storage. Please log in.");
      }
    } catch (error) {
      // Логируем ошибку только если она не является ожидаемой ошибкой отсутствия данных пользователя.
      if (
        error instanceof Error &&
        error.message === "User data not found in local storage. Please log in."
      ) {
        // Это ожидаемое состояние (пользователь не авторизован), просто перебрасываем ошибку без дополнительного логирования.
      } else {
        console.error(
          "Ошибка при получении текущего пользователя из хранилища:",
          error
        );
      }
      throw error; // Перебрасываем ошибку для дальнейшей обработки
    }
  },

  getCompanyUsers: async () => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    const response = await api.get("/all-users-company", {
      params: getAuthParams(),
    });

    const users = z
      .object({
        users: userSchema.array(),
        departments: z.string().array().optional(),
      })
      .parse(response.data);

    return users;
  },

  editUser: async (payload: EditUserPayload) => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    const response = await api.put("/edit-user", payload, {
      params: getAuthParams(),
    });

    if (response.data?.Status === "OK") {
      return editUserSchema.safeParse(response.data.user);
    }

    const errorMsg = response.data?.message || "Unknown error";
    console.error("Edit user error:", response.data);
    throw new Error(`Ошибка API: ${errorMsg}`);
  },

  dismissUser: async (userId: number) => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    await api.put(
      "/dismiss-user",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeMainAdmin: async (userId: number) => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    await api.put(
      "/make-main-admin",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeCompanyAdmin: async (userId: number) => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    await api.put(
      "/make-company-admin",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeShiftManager: async (userId: number) => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    await api.put(
      "/make-shift-manager",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeOperator: async (userId: number) => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    await api.put(
      "/make-operator",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  getCompanyAdmins: async () => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    const response = await api.get("/users-show-company-admins", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },

  getShiftManagers: async () => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    const response = await api.get("/users-show-shift-managers", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },

  getOperators: async () => {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    const response = await api.get("/users-show-operators", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },
};