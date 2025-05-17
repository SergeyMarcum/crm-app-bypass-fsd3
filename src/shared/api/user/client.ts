// src/shared/api/user/client.ts

import axios from "../axios";
import { userSchema, editUserSchema } from "@shared/lib/schemas";
import { EditUserPayload } from "@entities/user/types";
import { z } from "zod";

const getAuthParams = () => ({
  domain: localStorage.getItem("auth_domain") || "",
  username: localStorage.getItem("username") || "",
  session_code: localStorage.getItem("session_token") || "",
});

export const userApi = {
  getCurrentUser: async () => {
    const response = await axios.get("/current-user", {
      params: getAuthParams(),
    });
    return userSchema.parse(response.data);
  },

  getCompanyUsers: async () => {
    const response = await axios.get("/all-users-company", {
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
    const response = await axios.put("/edit-user", payload, {
      params: getAuthParams(),
    });
    return editUserSchema.parse(response.data);
  },

  dismissUser: async (userId: number) => {
    await axios.put(
      "/dismiss-user",
      { user_id: userId },
      {
        params: getAuthParams(),
      }
    );
  },

  makeMainAdmin: async (userId: number) => {
    await axios.put(
      "/make-main-admin",
      { user_id: userId },
      {
        params: getAuthParams(),
      }
    );
  },

  makeCompanyAdmin: async (userId: number) => {
    await axios.put(
      "/make-company-admin",
      { user_id: userId },
      {
        params: getAuthParams(),
      }
    );
  },

  makeShiftManager: async (userId: number) => {
    await axios.put(
      "/make-shift-manager",
      { user_id: userId },
      {
        params: getAuthParams(),
      }
    );
  },

  makeOperator: async (userId: number) => {
    await axios.put(
      "/make-operator",
      { user_id: userId },
      {
        params: getAuthParams(),
      }
    );
  },

  getCompanyAdmins: async () => {
    const response = await axios.get("/users-show-company-admins", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },

  getShiftManagers: async () => {
    const response = await axios.get("/users-show-shift-managers", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },

  getOperators: async () => {
    const response = await axios.get("/users-show-operators", {
      params: getAuthParams(),
    });
    return userSchema.array().parse(response.data);
  },
};
