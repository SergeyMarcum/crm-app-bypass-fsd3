// src/shared/api/user/client.ts
import { api } from "@/shared/api/axios";
import { userSchema, editUserSchema } from "@shared/lib/schemas";
import { EditUserPayload } from "@entities/user/types";
import { z } from "zod";
import { getAuthParams } from "@/shared/lib/auth";
import { storage } from "@/shared/lib/storage";

type UserSchemaType = z.infer<typeof userSchema>;

export const userApi = {
  getCurrentUser: async () => {
    try {
      const userFromStorage = storage.get("auth_user");
      if (userFromStorage) {
        const userData = JSON.parse(userFromStorage);
        console.log("Raw user data from storage:", userData);
        const normalizedData = {
          ...userData,
          id: userData.user_id ?? null, // Нормализуем user_id в id
          status_id: userData.status_id ?? null,
          domain: userData.domain ?? null,
          name: userData.name ?? null,
          photo: userData.photo ?? null,
        };
        return userSchema.parse(normalizedData);
      } else {
        throw new Error("User data not found in local storage. Please log in.");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "User data not found in local storage. Please log in."
      ) {
        // Ожидаемое состояние, не логируем
      } else {
        console.error(
          "Ошибка при получении текущего пользователя из хранилища:",
          error
        );
      }
      throw error;
    }
  },

  getCompanyUsers: async () => {
    const response = await api.get("/all-users-company", {
      params: getAuthParams(),
    });

    const normalizedData = {
      ...response.data,
      users: response.data.users.map((user: UserSchemaType) => ({
        ...user,
        id: user.id ?? user.user_id ?? null, // Поддержка user_id или id
        status_id: user.status_id ?? null,
        photo: user.photo ?? null,
      })),
    };

    const users = z
      .object({
        users: userSchema.array(),
        departments: z.string().array().optional(),
      })
      .parse(normalizedData);

    return users;
  },

  editUser: async (payload: EditUserPayload) => {
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
    await api.put(
      "/dismiss-user",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeMainAdmin: async (userId: number) => {
    await api.put(
      "/make-main-admin",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeCompanyAdmin: async (userId: number) => {
    await api.put(
      "/make-company-admin",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeShiftManager: async (userId: number) => {
    await api.put(
      "/make-shift-manager",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  makeOperator: async (userId: number) => {
    await api.put(
      "/make-operator",
      { user_id: userId },
      { params: getAuthParams() }
    );
  },

  getCompanyAdmins: async () => {
    const response = await api.get("/users-show-company-admins", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },

  getShiftManagers: async () => {
    const response = await api.get("/users-show-shift-managers", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },

  getOperators: async () => {
    const response = await api.get("/users-show-operators", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },
};
