// src/shared/api/object-type/client.ts
import axiosInstance from "@/shared/api/axios";
import type {
  Incongruity,
  ParameterOption,
} from "@/widgets/add-parameter-modal/types";
import { AxiosError } from "axios";
import { getAuthParams } from "@/shared/lib/auth";
import type { IncongruityCase } from "./types";

export const objectTypeApi = {
  async getObjectTypeParameters(
    objectTypeId: number
  ): Promise<{ id: number; parameter: string }[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get(
        "/object-type-parameters",
        {
          params: { // Объединяем все параметры запроса здесь
            ...authParams,
            id: objectTypeId
          }
        }
      );
      if (!Array.isArray(res.data)) {
        throw new Error("Invalid response format: expected array");
      }
      return res.data.map((item: { id: number; name: string }) => ({
        id: item.id,
        parameter: item.name,
      }));
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при получении параметров типа объекта:",
        err.message
      );
      throw err;
    }
  },

  async getAllObjectTypes(): Promise<{ id: number; name: string }[]> {
    try {
      const res = await axiosInstance.get("/all-object-types", { // Corrected line
        params: getAuthParams(), // Correctly passing parameters
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех типов объектов:", err.message);
      throw err;
    }
  },

async getAllParameters(): Promise<{ id: number; name: string }[]> {
    try {
      const res = await axiosInstance.get("/parameters", {
        params: getAuthParams(),
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех параметров:", err.message);
      throw err;
    }
  },

  async getAllIncongruities(): Promise<Incongruity[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get(
        "/cases-of-non-compliance", // Путь без параметров
        {
          params: authParams // Объект params для всех параметров запроса
        }
      );
      // Дополнительная проверка на случай, если API все же вернет не массив
      if (!Array.isArray(res.data)) {
        console.error("Неверный формат ответа для getAllIncongruities: ожидался массив", res.data);
        return []; // Возвращаем пустой массив, чтобы предотвратить ошибку .find() в UI
      }
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех несоответствий:", err.message);
      throw err; // Перебрасываем ошибку для обработки выше по стеку
    }
  },

// Эта функция больше не будет использоваться для добавления НОВОГО параметра
  // Она предназначена для редактирования СУЩЕСТВУЮЩЕГО типа объекта (его id, name, и связанного списка parameter_ids)
  async saveObjectTypeParam(data: {
    id: number;
    name: string;
    parameter_ids: number[];
  }): Promise<void> {
    // Получаем параметры аутентификации
    const authParams = getAuthParams();
    await axiosInstance.put(
      "/edit-object-type", // Базовый URL без параметров
      data, // Тело запроса
      {
        params: authParams, // Передаем параметры аутентификации в объект конфигурации Axios
      }
    );
  },

  // НОВАЯ ФУНКЦИЯ: Добавление нового параметра проверки объекта
  async addNewParameter(name: string): Promise<{ id: number; name: string }> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.post(
        "/add-new-parameter",
        { name }, // Тело запроса с именем нового параметра
        {
          params: authParams, // Параметры аутентификации в запросе
        }
      );
      // Предполагаем, что бэкенд возвращает созданный объект с ID
      if (typeof res.data !== 'object' || res.data === null || typeof res.data.id !== 'number') {
          console.error("Неверный формат ответа для addNewParameter: ожидался объект с id", res.data);
          throw new Error("Invalid response format for addNewParameter");
      }
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при добавлении нового параметра:", err.message);
      throw err;
    }
  },

  async editParameter(data: { id: number; name: string }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.put(
        "/edit-parameter", // Базовый путь
        data, // Тело запроса
        {
          params: authParams // Передаем параметры аутентификации как параметры запроса
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при редактировании параметра:", err.message);
      throw err;
    }
  },

  async getParameterIncongruities(paramId: number): Promise<Incongruity[]> {
    try {
      const res = await axiosInstance.get(
        `/all-cases-of-parameter-non-compliance${getAuthParams()}&param_id=${paramId}`
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 404) {
        console.warn(`Несоответствия не найдены для параметра ${paramId}`);
        return [];
      }
      throw err;
    }
  },

 async getAllCasesOfParameterNonCompliance(
    param_id: number
  ): Promise<IncongruityCase[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get(
        "/all-cases-of-parameter-non-compliance", // Путь без параметров
        {
          params: { // Объект params для всех параметров запроса
            ...authParams, // Параметры аутентификации
            param_id: param_id // ID параметра
          }
        }
      );
      // Дополнительная проверка на случай, если API все же вернет не массив
      if (!Array.isArray(res.data)) {
        console.error("Неверный формат ответа для getAllCasesOfParameterNonCompliance: ожидался массив", res.data);
        return []; // Возвращаем пустой массив, чтобы предотвратить ошибку .map() в UI
      }
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при получении всех несоответствий параметра:",
        err.message
      );
      // Перебрасываем ошибку, чтобы она была обработана выше по стеку,
      // например, в Promise.all().catch()
      throw err;
    }
  },

  async addParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.post(
        "/add-parameter-non-compliance", // Базовый URL
        data, // Тело запроса
        {
          params: authParams // Передаем authParams как параметры запроса
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при добавлении несоответствия параметра:", err.message);
      throw err;
    }
  },

 async updateParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[];
  }): Promise<void> {
    await axiosInstance.put(
      `/edit-parameter-non-compliance${getAuthParams()}`,
      data
    );
  },

  async deleteParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[]; // Изменено на массив чисел
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.delete(
        "/delete-parameter-non-compliance", // Базовый URL
        {
          params: authParams, // Передаем параметры аутентификации как параметры запроса
          data, // Передаем тело запроса
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при удалении несоответствия параметра:", err.message);
      throw err;
    }
  },
};
