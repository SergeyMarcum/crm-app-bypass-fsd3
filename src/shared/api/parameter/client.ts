// src/shared/api/parameter/client.ts
import axiosInstance from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import type {
  Incongruity,
  IncongruityCase,
  AddNewParameterSuccessResponse,
} from "./types";
import { AxiosError } from "axios"; // Импортируем AxiosError

export const parameterApi = {
  /**
   * Получает все параметры, связанные с определенным типом объекта.
   * @param objectTypeId ID типа объекта.
   * @returns Массив объектов { id: number; parameter: string }.
   */
  async getParametersByObjectType(
    objectTypeId: number
  ): Promise<{ id: number; parameter: string }[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/object-type-parameters", {
        params: {
          ...authParams,
          id: objectTypeId,
        },
      });
      if (!Array.isArray(res.data)) {
        throw new Error("Invalid response format: expected array");
      }
      return res.data.map((item: { id: number; name: string }) => ({
        id: item.id,
        parameter: item.name,
      }));
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError для безопасного приведения
      console.error(
        "Ошибка при получении параметров по типу объекта:",
        err.message
      );
      throw err;
    }
  },

  /**
   * Получает все доступные параметры в системе.
   * @returns Массив объектов { id: number; name: string }.
   */
  async getAllParameters(): Promise<{ id: number; name: string }[]> {
    try {
      const res = await axiosInstance.get("/parameters", {
        params: getAuthParams(),
      });
      return res.data as { id: number; name: string }[];
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError
      console.error("Ошибка при получении всех параметров:", err.message);
      throw err;
    }
  },

  /**
   * Получает все возможные случаи несоответствий.
   * @returns Массив объектов Incongruity.
   */
  async getAllIncongruities(): Promise<Incongruity[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get("/cases-of-non-compliance", {
        params: authParams,
      });
      if (!Array.isArray(res.data)) {
        console.error(
          "Неверный формат ответа для getAllIncongruities: ожидался массив",
          res.data
        );
        return [];
      }
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError
      console.error("Ошибка при получении всех несоответствий:", err.message);
      throw err;
    }
  },

  /**
   * Добавляет новый параметр.
   * @param name Название параметра.
   * @param non_comp_ids Массив ID несоответствий, связанных с параметром.
   * @returns Объект успешного ответа.
   */
  async addNewParameter(
    name: string,
    non_comp_ids: number[] = []
  ): Promise<AddNewParameterSuccessResponse> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.post<AddNewParameterSuccessResponse>(
        `${import.meta.env.VITE_API_URL}/add-new-parameter`,
        { name, non_comp_ids },
        {
          params: authParams,
        }
      );
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError
      console.error("Ошибка при добавлении нового параметра:", err.message);
      throw err;
    }
  },

  /**
   * Редактирует существующий параметр.
   * @param data Объект с ID и новым именем параметра.
   */
  async editParameter(data: { id: number; name: string }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.put("/edit-parameter", data, {
        params: authParams,
      });
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError
      console.error("Ошибка при редактировании параметра:", err.message);
      throw err;
    }
  },

  /**
   * Получает несоответствия для конкретного параметра.
   * Этот метод объединяет логику `getParameterIncongruities` и `getAllCasesOfParameterNonCompliance`.
   * @param paramId ID параметра.
   * @returns Массив объектов IncongruityCase.
   */
  async getParameterIncongruities(paramId: number): Promise<IncongruityCase[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get(
        "/all-cases-of-parameter-non-compliance",
        {
          params: {
            ...authParams,
            param_id: paramId,
          },
        }
      );
      if (!Array.isArray(res.data)) {
        console.error(
          "Неверный формат ответа для getParameterIncongruities: ожидался массив",
          res.data
        );
        return [];
      }
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError
      if (err.response?.status === 404) {
        console.warn(`Несоответствия не найдены для параметра ${paramId}`);
        return [];
      }
      console.error(
        "Ошибка при получении несоответствий параметра:",
        err.message
      );
      throw err;
    }
  },

  /**
   * Добавляет несоответствия к параметру.
   * @param data Объект с ID параметра и массивом ID несоответствий.
   */
  async addParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.post("/add-parameter-non-compliance", data, {
        params: authParams,
      });
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError
      console.error(
        "Ошибка при добавлении несоответствия параметра:",
        err.message
      );
      throw err;
    }
  },

  /**
   * Обновляет несоответствия для параметра.
   * @param data Объект с ID параметра и массивом ID несоответствий.
   */
  async updateParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/edit-parameter-non-compliance`,
        data,
        {
          params: authParams,
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError
      console.error(
        "Ошибка при обновлении несоответствия параметра:",
        err.message
      );
      throw err;
    }
  },

  /**
   * Удаляет несоответствия у параметра.
   * @param data Объект с ID параметра и массивом ID несоответствий для удаления.
   */
  async deleteParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/delete-parameter-non-compliance`,
        {
          params: authParams,
          data, // Для DELETE запросов с телом, 'data' передается через опции Axios
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError; // Используем AxiosError
      console.error(
        "Ошибка при удалении несоответствия параметра:",
        err.message
      );
      throw err;
    }
  },
};
