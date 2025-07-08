// src/shared/api/object-type/client.ts
import axiosInstance from "@/shared/api/axios";
import type { Incongruity } from "@/widgets/add-parameter-modal/types";
import { AxiosError } from "axios";
import { getAuthParams } from "@/shared/lib/auth";
import type { IncongruityCase } from "./types";

// Define the expected successful response type for addNewParameter
interface AddNewParameterSuccessResponse {
  message: string;
  parameter: Record<string, unknown>; // Use Record<string, unknown> for an empty object or any future properties
}

// Define the expected successful response type for addNewObjectType (if any)
interface AddNewObjectTypeSuccessResponse {
  message: string; // Assuming a success message
  // Add other fields if the backend returns them, e.g., 'objectType: { id: number; name: string }'
}

export const objectTypeApi = {
  async getObjectTypeParameters(
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

  async getAllParameters(): Promise<{ id: number; number: string }[]> {
    try {
      const res = await axiosInstance.get("/parameters", {
        params: getAuthParams(),
      });

      return res.data as { id: number; number: string }[];
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех параметров:", err.message);
      throw err;
    }
  },

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
      const err = error as AxiosError;
      console.error("Ошибка при получении всех несоответствий:", err.message);
      throw err;
    }
  },

  async saveObjectTypeParam(data: {
    id: number;
    name: string;
    parameter_ids: number[];
  }): Promise<void> {
    const authParams = getAuthParams();
    await axiosInstance.put("/edit-object-type", data, {
      params: authParams,
    });
  },

  async addNewParameter(
    name: string,
    non_comp_ids: number[] = []
  ): Promise<AddNewParameterSuccessResponse> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.post<AddNewParameterSuccessResponse>(
        "http://192.168.1.243:82/add-new-parameter", // Use the correct IP for your backend
        { name, non_comp_ids },
        {
          params: authParams,
        }
      );

      console.log("Ответ сервера при добавлении параметра (res):", res);

      if (
        res.data &&
        typeof res.data.message === "string" &&
        typeof res.data.parameter === "object"
      ) {
        return res.data;
      } else {
        throw new Error(
          "Неверный формат ответа для addNewParameter: ожидался объект с полями 'message' и 'parameter'"
        );
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при добавлении нового параметра:", err.message);
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },

  // --- НОВЫЙ МЕТОД: addNewObjectType ---
  async addNewObjectType(
    name: string,
    parameter_ids: number[] = []
  ): Promise<AddNewObjectTypeSuccessResponse> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.post<AddNewObjectTypeSuccessResponse>(
        "http://192.168.1.243:82/add-object-type", // Use the correct IP for your backend based on your provided API table
        { name, parameter_ids },
        {
          params: authParams,
        }
      );
      // Backend returns '-', so we'll assume a success if no error is thrown
      // If backend ever returns a success message/object, adjust this.
      console.log("Ответ сервера при добавлении типа объекта:", res);
      // For now, if no error, consider it a success and return a generic message.
      // If the backend sends an empty response for success, you'd adjust this.
      return {
        message:
          "Тип объекта успешно добавлен" /* add other fields if they exist */,
      };
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при добавлении нового типа объекта:", err.message);
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err; // Re-throw to be handled by the UI
    }
  },
  // --- КОНЕЦ НОВОГО МЕТОДА ---

  async editParameter(data: { id: number; name: string }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.put("/edit-parameter", data, {
        params: authParams,
      });
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при редактировании параметра:", err.message);
      throw err;
    }
  },

  async getParameterIncongruities(paramId: number): Promise<Incongruity[]> {
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
        "/all-cases-of-parameter-non-compliance",
        {
          params: {
            ...authParams,
            param_id: param_id,
          },
        }
      );
      if (!Array.isArray(res.data)) {
        console.error(
          "Неверный формат ответа для getAllCasesOfParameterNonCompliance: ожидался массив",
          res.data
        );
        return [];
      }
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при получении всех несоответствий параметра:",
        err.message
      );
      throw err;
    }
  },

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
      const err = error as AxiosError;
      console.error(
        "Ошибка при добавлении несоответствия параметра:",
        err.message
      );
      throw err;
    }
  },

  async updateParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.put(
        "http://192.168.1.243:82/edit-parameter-non-compliance", // Use the correct IP for your backend
        data,
        {
          params: authParams,
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при обновлении несоответствия параметра:",
        err.message
      );
      throw err;
    }
  },

  async deleteParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await axiosInstance.delete(
        "http://192.168.1.243:82/delete-parameter-non-compliance", // Use the correct IP for your backend
        {
          params: authParams,
          data,
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        "Ошибка при удалении несоответствия параметра:",
        err.message
      );
      throw err;
    }
  },
};
