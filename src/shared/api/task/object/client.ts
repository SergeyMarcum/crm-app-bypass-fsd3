// src/shared/api/task/object/client.ts
// ИСПРАВЛЕНИЕ: Изменен импорт с default на именованный экспорт 'api'
import { api } from "@/shared/api/axios"; // Импортируем именованный экспорт 'api'
import { getAuthParams } from "@/shared/lib/auth";
import {
  ObjectItem,
  GetObjectParametersResponse,
} from "./types";
import { AxiosError } from "axios";

export const objectApi = {
  async getAllObjects(): Promise<ObjectItem[]> {
    try {
      const authParams = getAuthParams();
      // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
      const res = await api.get("/all-domain-objects", {
        params: authParams,
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех объектов:", err.message);
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },

  async searchObjects(query: string = ""): Promise<ObjectItem[]> {
    try {
      const authParams = getAuthParams();
      // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
      const res = await api.get("/search", {
        params: {
          ...authParams,
          query: query,
        },
      });
      return res.data.object_search_result || [];
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при поиске объектов:", err.message);
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },

  /**
   * Получает параметры проверки и тип объекта по его ID.
   * @param objectId ID объекта, для которого нужно получить параметры.
   */
  async getParametersAndObjectType(
    objectId: string
  ): Promise<GetObjectParametersResponse> {
    try {
      const authParams = getAuthParams();
      // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
      const res = await api.get("/object/get", {
        params: {
          ...authParams,
          object_id: objectId, // Предполагаем, что API ожидает object_id
        },
      });
      // Предполагаем, что API возвращает объект с полем 'parameters' (массив InspectionParameter)
      // и опционально 'object_type'
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        `Ошибка при получении параметров объекта ${objectId}:`,
        err.message
      );
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },
};