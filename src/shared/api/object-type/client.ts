// src/shared/api/object-type/client.ts
import { api } from "@/shared/api/axios";
import { AxiosError } from "axios";
import { getAuthParams } from "@/shared/lib/auth";
import { Parameter } from "./types";

interface AddNewObjectTypeSuccessResponse {
  message: string;
}

export const objectTypeApi = {
  async getAllObjectTypes(): Promise<{ id: number; name: string }[]> {
    try {
      const res = await api.get("/all-object-types", {
        params: getAuthParams(),
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех типов объектов:", err.message);
      throw err;
    }
  },

  async getAllParameters(): Promise<Parameter[]> {
    try {
      const res = await api.get("/parameters", {
        params: getAuthParams(),
      });
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех параметров:", err.message);
      throw err;
    }
  },

  async getObjectTypeParameters(objectTypeId: number): Promise<Parameter[]> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/object-type-parameters", {
        params: {
          ...authParams,
          id: objectTypeId,
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

  async saveObjectTypeParam(data: {
    id: number;
    name: string;
    parameter_ids: number[];
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await api.put("/edit-object-type", data, {
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

  async addNewObjectType(
    name: string,
    parameter_ids: number[] = []
  ): Promise<AddNewObjectTypeSuccessResponse> {
    try {
      const authParams = getAuthParams();
      const res = await api.post<AddNewObjectTypeSuccessResponse>(
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

  async getObjectTypeById(
    id: number
  ): Promise<{ id: number; name: string } | null> {
    try {
      const authParams = getAuthParams();
      const res = await api.get(`/object-type-by-id`, {
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

  async addParameterToObjectType(data: {
    object_type_id: number;
    parameter_id: number;
  }): Promise<void> {
    try {
      const authParams = getAuthParams();
      await api.post("/add-parameter-to-object-type", data, {
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

  async deleteObjectTypeParameter(
    objectTypeId: number,
    parameterId: number
  ): Promise<void> {
    const params = getAuthParams();
    await api.delete("/parameter/delete-object-type-parameter", {
      params: { ...params },
      data: {
        object_type_id: objectTypeId,
        parameter_id: parameterId,
      },
    });
  },
};
