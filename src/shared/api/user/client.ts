// src/shared/api/user/client.ts
import axiosInstance from "@/shared/api/axios";
import { userSchema, editUserSchema } from "@shared/lib/schemas";
import { EditUserPayload } from "@entities/user/types";
import { z } from "zod";

const getAuthParams = () => {
  const domain = localStorage.getItem("auth_domain") || "";
  const username = localStorage.getItem("username") || "";
  const session_code = localStorage.getItem("session_token") || "";
  return { domain, username, session_code };
};

export const userApi = {
  getCurrentUser: async () => {
    const response = await axiosInstance.get("/current-user", {
      params: getAuthParams(),
    });
    return userSchema.parse(response.data);
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
