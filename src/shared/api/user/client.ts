// src/shared/api/user/client.ts
import axios from "../axios";
import { userSchema, editUserSchema } from "@shared/lib/schemas";
import { EditUserPayload } from "@entities/user/types";

export const userApi = {
  getCurrentUser: async () => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    const response = await axios.get("/current-user", {
      params: { domain, username, session_code: sessionCode },
    });
    return userSchema.parse(response.data);
  },

  // Получение всех пользователей филиала
  getCompanyUsers: async () => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    console.log("getCompanyUsers params:", { domain, username, sessionCode });
    const response = await axios.get("/all-users-company", {
      params: { domain, username, session_code: sessionCode },
    });
    console.log("getCompanyUsers response:", response.data);
    return response.data;
  },

  // Редактирование пользователя
  editUser: async (payload: EditUserPayload) => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    const response = await axios.put("/edit-user", payload, {
      params: { domain, username, session_code: sessionCode },
    });
    return editUserSchema.parse(response.data);
  },

  // Увольнение пользователя
  dismissUser: async (userId: number) => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    await axios.put(
      "/dismiss-user",
      { user_id: userId },
      {
        params: { domain, username, session_code: sessionCode },
      }
    );
  },

  // Назначение администратора общества
  makeMainAdmin: async (userId: number) => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    await axios.put(
      "/make-main-admin",
      { user_id: userId },
      {
        params: { domain, username, session_code: sessionCode },
      }
    );
  },

  // Назначение администратора филиала
  makeCompanyAdmin: async (userId: number) => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    await axios.put(
      "/make-company-admin",
      { user_id: userId },
      {
        params: { domain, username, session_code: sessionCode },
      }
    );
  },

  // Назначение руководителя смены
  makeShiftManager: async (userId: number) => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    await axios.put(
      "/make-shift-manager",
      { user_id: userId },
      {
        params: { domain, username, session_code: sessionCode },
      }
    );
  },

  // Назначение оператора
  makeOperator: async (userId: number) => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    await axios.put(
      "/make-operator",
      { user_id: userId },
      {
        params: { domain, username, session_code: sessionCode },
      }
    );
  },

  // Получение администраторов филиалов
  getCompanyAdmins: async () => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    const response = await axios.get("/users-show-company-admins", {
      params: { domain, username, session_code: sessionCode },
    });
    return userSchema.array().parse(response.data);
  },

  // Получение руководителей смен
  getShiftManagers: async () => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    const response = await axios.get("/users-show-shift-managers", {
      params: { domain, username, session_code: sessionCode },
    });
    return userSchema.array().parse(response.data);
  },

  // Получение операторов
  getOperators: async () => {
    const domain = localStorage.getItem("auth_domain") || "";
    const username = localStorage.getItem("username") || "";
    const sessionCode = localStorage.getItem("session_token") || "";
    const response = await axios.get("/users-show-operators", {
      params: { domain, username, session_code: sessionCode },
    });
    return userSchema.array().parse(response.data);
  },
};
