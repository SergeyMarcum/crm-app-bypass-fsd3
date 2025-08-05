// src/shared/api/object/client.ts

import { api } from "@/shared/api/axios"; // Импортируем именованный экспорт 'api'
import { getAuthParams } from "@/shared/lib/auth";
import type {
  DomainObject,
  ObjectDetail,
  ObjectTask,
} from "@/entities/object/types";

// Определяем интерфейс для ожидаемого объекта ошибки API
interface ApiResponseError {
  status: "Error";
  message: string;
}

export const objectApi = {
  async getAll(): Promise<DomainObject[]> {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    const res = await api.get("/all-objects", {
      params: getAuthParams(),
    });
    return res.data;
  },

  async create(data: {
    name: string;
    address: string;
    characteristic: string;
    parameters: number[];
    object_type: number;
    domain: string;
  }): Promise<void> {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    await api.post("/add-new-object", data, {
      params: getAuthParams(),
    });
  },

  async update(data: {
    id: number;
    name: string;
    address: string;
    characteristic: string;
    parameters: number[];
    object_type: number;
    domain: string;
  }): Promise<void> {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    await api.put("/object/edit", data, {
      params: getAuthParams(),
    });
  },

  async getAllDomainObjects(): Promise<DomainObject[]> {
    try {
      // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
      const res = await api.get("/all-domain-objects", {
        params: getAuthParams(),
      });

      // Защитник типа для проверки, является ли объект ошибкой API
      // Принимаем `unknown` и безопасно проверяем свойства
      const isApiResponseError = (data: unknown): data is ApiResponseError => {
        return (
          typeof data === "object" &&
          data !== null &&
          (data as Record<string, unknown>).status === "Error" &&
          typeof (data as Record<string, unknown>).message === "string"
        );
      };

      if (isApiResponseError(res.data)) {
        throw new Error(`Ошибка API: ${res.data.message}`);
      }

      if (!Array.isArray(res.data)) {
        throw new Error(
          "Ожидался массив объектов, получено: " + JSON.stringify(res.data)
        );
      }

      return res.data;
    } catch (error) {
      // Перебрасываем ошибку, чтобы она была обработана в компоненте UI
      throw error;
    }
  },

  async getById(objectId: number): Promise<ObjectDetail> {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    const res = await api.get("/object/get", {
      params: {
        ...getAuthParams(),
        object_id: objectId,
      },
    });
    return res.data;
  },

  async getObjectTasks(objectId: number): Promise<ObjectTask[]> {
    // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
    const res = await api.get("/object/tasks", {
      params: {
        ...getAuthParams(),
        object_id: objectId,
      },
    });
    return res.data;
  },
};
