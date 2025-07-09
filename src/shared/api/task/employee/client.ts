// src/shared/api/task/employee/client.ts
import axiosInstance from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import { User } from "./types";
import { AxiosError } from "axios";

export const employeeApi = {
  /**
   * Получает всех операторов.
   * Использует новый эндпоинт /users-show-operators.
   */
  async getAllOperators(): Promise<User[]> {
    // Переименовано для ясности
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/users-show-operators", {
        // Использован новый эндпоинт
        params: authParams,
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех операторов:", err.message);
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },

  /**
   * Получает всех руководителей смен (мастеров).
   * Использует новый эндпоинт /users-show-shift-managers.
   */
  async getAllShiftManagers(): Promise<User[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/users-show-shift-managers", {
        // Новый эндпоинт
        params: authParams,
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при получении всех руководителей смен:",
        err.message
      );
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },

  /**
   * Поиск пользователей по запросу.
   * Может быть использован, если нет прямого эндпоинта для всех пользователей.
   * Оставлен на случай, если бэкенд все еще поддерживает этот эндпоинт для общего поиска.
   */
  async searchUsers(query: string = ""): Promise<User[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/search", {
        params: {
          ...authParams,
          query: query,
        },
      });
      // Предполагается, что API возвращает user_search_result в качестве части ответа
      return res.data.user_search_result || [];
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при поиске пользователей:", err.message);
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },
};
