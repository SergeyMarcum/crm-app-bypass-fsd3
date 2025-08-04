// src/shared/api/task/object/client.ts
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import { AxiosError } from "axios";
import {
  ObjectItem,
  GetObjectParametersResponse,
  InspectionParameter,
  ParameterResponseItem, // Добавлен новый тип
} from "./types";

export const objectApi = {
  /**
   * Получает список всех объектов в домене.
   * @returns Промис, возвращающий массив объектов `ObjectItem`.
   */
  async getAllObjects(): Promise<ObjectItem[]> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/all-domain-objects", {
        params: authParams,
      });
      return res.data;
    } catch (error) {
      return handleAxiosError("получении всех объектов", error);
    }
  },

  /**
   * Выполняет поиск объектов по строке запроса.
   * @param query Поисковый запрос (опционально).
   * @returns Промис, возвращающий массив объектов `ObjectItem`.
   */
  async searchObjects(query: string = ""): Promise<ObjectItem[]> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/search", {
        params: {
          ...authParams,
          query,
        },
      });
      return res.data.object_search_result || [];
    } catch (error) {
      return handleAxiosError("поиске объектов", error);
    }
  },

  /**
   * Получает параметры проверки и информацию об объекте по его ID.
   * @param objectId ID объекта, для которого нужно получить параметры.
   * @returns Промис, возвращающий объект `GetObjectParametersResponse`.
   */
  async getParametersAndObjectType(
    objectId: string
  ): Promise<GetObjectParametersResponse> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/object/get", {
        params: {
          ...authParams,
          object_id: objectId,
        },
      });
      return res.data;
    } catch (error) {
      return handleAxiosError(
        `получении параметров объекта ${objectId}`,
        error
      );
    }
  },

  /**
   * Получает список всех параметров проверки.
   * @returns Промис, возвращающий массив параметров `InspectionParameter`.
   */
  async getAllParameters(): Promise<InspectionParameter[]> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/parameters", {
        params: authParams,
      });
      const normalizedParameters: InspectionParameter[] = res.data.map(
        (param: ParameterResponseItem, index: number) => ({
          id: param.id || index + 1,
          name: param.name || "Без названия",
          type: param.type || "unknown",
        })
      );
      return normalizedParameters;
    } catch (error) {
      return handleAxiosError("получении всех параметров", error);
    }
  },
};

/**
 * Обработчик ошибок для запросов Axios.
 * @param context Контекст ошибки (описание действия).
 * @param error Объект ошибки.
 * @throws Ошибка Axios с дополнительной информацией.
 */
function handleAxiosError(context: string, error: unknown): never {
  const err = error as AxiosError;
  console.error(`Ошибка при ${context}:`, err.message);
  if (err.response?.data) {
    console.error("Детали ошибки от сервера:", err.response.data);
  }
  throw err;
}
