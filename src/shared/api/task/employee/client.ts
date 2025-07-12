// src/shared/api/task/employee/client.ts
import axiosInstance from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import { User } from "./types";
import { AxiosError } from "axios";

export const employeeApi = {
  /**
   * Получает всех операторов (role_id = 4).
   */
  async getAllOperators(): Promise<User[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/users-show-operators", {
        params: authParams,
      });
      return res.data;
    } catch (error) {
      handleAxiosError("получении всех операторов", error);
    }
  },

  /**
   * Получает всех руководителей смен (мастеров, role_id = 3).
   */
  async getAllShiftManagers(): Promise<User[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/users-show-shift-managers", {
        params: authParams,
      });
      return res.data;
    } catch (error) {
      handleAxiosError("получении всех руководителей смен", error);
    }
  },

  /**
   * Получает всех администраторов филиалов (role_id = 2).
   */
  async getAllCompanyAdmins(): Promise<User[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/users-show-company-admins", {
        params: authParams,
      });
      return res.data;
    } catch (error) {
      handleAxiosError("получении всех администраторов филиалов", error);
    }
  },

  /**
   * Поиск пользователей по строке запроса.
   */
  async searchUsers(query: string = ""): Promise<User[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/search", {
        params: { ...authParams, query },
      });
      return res.data.user_search_result || [];
    } catch (error) {
      handleAxiosError("поиске пользователей", error);
    }
  },
};

function handleAxiosError(context: string, error: unknown): never {
  const err = error as AxiosError;
  console.error(`Ошибка при ${context}:`, err.message);
  if (err.response?.data) {
    console.error("Детали ошибки от сервера:", err.response.data);
  }
  throw err;
}
