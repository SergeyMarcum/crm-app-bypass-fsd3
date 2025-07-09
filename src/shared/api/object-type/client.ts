// src/shared/api/object-type/client.ts
import axiosInstance from "@/shared/api/axios";
import { AxiosError } from "axios";
import { getAuthParams } from "@/shared/lib/auth";
import { Parameter } from "./types"; // Импортируем общий тип Parameter

interface AddNewObjectTypeSuccessResponse {
  message: string;
}

export const objectTypeApi = {
  /**
   * Получает все типы объектов.
   * @returns Массив объектов { id: number; name: string }.
   */
  async getAllObjectTypes(): Promise<{ id: number; name: string }[]> {
    try {
      const res = await axiosInstance.get("/all-object-types", {
        params: getAuthParams(),
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех типов объектов:", err.message);
      throw err;
    }
  },

  /**
   * Получает все параметры проверки объекта из базы данных.
   * Соответствует API: GET /parameters.
   * @returns Массив параметров { id: number; name: string }.
   */
  async getAllParameters(): Promise<Parameter[]> {
    try {
      const res = await axiosInstance.get("/parameters", {
        params: getAuthParams(),
      });
      // Структура ответа: [{"id":1,"name":"..."}]
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех параметров:", err.message);
      throw err;
    }
  },

  /**
   * Получает параметры для конкретного типа объекта по его ID.
   * Соответствует API: GET /object-type-parameters?id=<id тип объекта>
   * Теперь API возвращает объекты с полем 'name'.
   * @param objectTypeId ID типа объекта.
   * @returns Массив параметров { id: number; name: string }.
   */
  async getObjectTypeParameters(objectTypeId: number): Promise<Parameter[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/object-type-parameters", {
        params: {
          ...authParams,
          id: objectTypeId, // Изменено с object_type_id на id
        },
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        `Ошибка при получении параметров для типа объекта с ID ${objectTypeId}:`,
        err.message
      );
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },

  /**
   * Сохраняет параметры для типа объекта.
   * @param data Объект с ID типа объекта, именем и массивом ID параметров.
   */
  async saveObjectTypeParam(data: {
    id: number;
    name: string;
    parameter_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.put("/edit-object-type", data, {
        params: authParams,
      });
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при сохранении параметров типа объекта:",
        err.message
      );
      throw err;
    }
  },

  /**
   * Добавляет новый тип объекта.
   * @param name Название нового типа объекта.
   * @param parameter_ids Массив ID параметров, связанных с новым типом объекта.
   * @returns Объект успешного ответа.
   */
  async addNewObjectType(
    name: string,
    parameter_ids: number[] = []
  ): Promise<AddNewObjectTypeSuccessResponse> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.post<AddNewObjectTypeSuccessResponse>(
        `${import.meta.env.VITE_API_URL}/add-object-type`,
        { name, parameter_ids },
        {
          params: authParams,
        }
      );
      console.log("Ответ сервера при добавлении типа объекта:", res);
      return { message: "Тип объекта успешно добавлен" };
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при добавлении нового типа объекта:", err.message);
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },

  /**
   * Получает тип объекта по ID.
   * @param id ID типа объекта.
   * @returns Объект типа { id: number; name: string } или null, если не найден.
   */
  async getObjectTypeById(
    id: number
  ): Promise<{ id: number; name: string } | null> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get(`/object-type-by-id`, {
        params: {
          ...authParams,
          id: id,
        },
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 404) {
        console.warn(`Тип объекта с ID ${id} не найден.`);
        return null;
      }
      console.error("Ошибка при получении типа объекта по ID:", err.message);
      throw err;
    }
  },

  /**
   * Добавляет существующий параметр к указанному типу объекта.
   * @param data Объект с ID типа объекта и ID параметра.
   */
  async addParameterToObjectType(data: {
    object_type_id: number;
    parameter_id: number;
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.post("/add-parameter-to-object-type", data, {
        params: authParams,
      });
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при добавлении параметра к типу объекта:",
        err.message
      );
      throw err;
    }
  },
};
