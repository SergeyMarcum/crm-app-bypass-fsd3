// src/shared/api/user/client.ts
import axiosInstance from "@/shared/api/axios";
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
    const response = await axiosInstance.get("/all-users-company", {
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
    const response = await axiosInstance.put("/edit-user", payload, {
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
    await axiosInstance.put(
      "/dismiss-user",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeMainAdmin: async (userId: number) => {
    await axiosInstance.put(
      "/make-main-admin",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeCompanyAdmin: async (userId: number) => {
    await axiosInstance.put(
      "/make-company-admin",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeShiftManager: async (userId: number) => {
    await axiosInstance.put(
      "/make-shift-manager",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeOperator: async (userId: number) => {
    await axiosInstance.put(
      "/make-operator",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  getCompanyAdmins: async () => {
    const response = await axiosInstance.get("/users-show-company-admins", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },

  getShiftManagers: async () => {
    const response = await axiosInstance.get("/users-show-shift-managers", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },

  getOperators: async () => {
    const response = await axiosInstance.get("/users-show-operators", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },
};
