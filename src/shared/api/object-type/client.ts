// src/shared/api/object-type/client.ts
import axiosInstance from "@/shared/api/axios";
import type {
  Incongruity,
  ParameterOption,
} from "@/widgets/add-parameter-modal/types";
import { AxiosError } from "axios";

function getAuthParams() {
  const domain = localStorage.getItem("auth_domain") || "";
  const username = localStorage.getItem("username") || "";
  const session_code = localStorage.getItem("session_token") || "";

  return {
    domain,
    username,
    session_code,
  };
}

export const objectTypeApi = {
  async getObjectTypeParameters(
    objectTypeId: number
  ): Promise<{ id: number; parameter: string }[]> {
    try {
      const res = await axiosInstance.get("/object-type-parameters", {
        params: {
          ...getAuthParams(),
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
    } catch (error) {
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
    } catch (error) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех типов объектов:", err.message);
      throw err;
    }
  },

  async getAllParameters(): Promise<ParameterOption[]> {
    const res = await axiosInstance.get("/parameters", {
      params: getAuthParams(),
    });
    return res.data;
  },

  async getAllIncongruities(): Promise<Incongruity[]> {
    const res = await axiosInstance.get("/cases-of-non-compliance", {
      params: getAuthParams(),
    });
    return res.data;
  },

  async saveObjectTypeParam(data: {
    id: number;
    name: string;
    parameter_ids: number[];
  }): Promise<void> {
    await axiosInstance.put("/edit-object-type", data, {
      params: getAuthParams(),
    });
  },

  async editParameter(data: { id: number; name: string }): Promise<void> {
    await axiosInstance.put("/edit-parameter", data, {
      params: getAuthParams(),
    });
  },

  async getParameterIncongruities(paramId: number): Promise<Incongruity[]> {
    try {
      const res = await axiosInstance.get(
        "/all-cases-of-parameter-non-compliance",
        {
          params: {
            ...getAuthParams(),
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

  async addParameterIncongruity(data: {
    id?: number;
    parameter_id: number;
    incongruity_id: number;
  }): Promise<void> {
    try {
      await axiosInstance.put("/edit-parameter-non-compliance", data, {
        params: getAuthParams(),
      });
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 404) {
        console.error(
          "❌ Сервер не нашёл ресурс при добавлении несоответствия"
        );
      }
      throw err;
    }
  },

  async deleteParameterIncongruity(data: {
    id: number;
    parameter_id: number;
    incongruity_id: number;
  }): Promise<void> {
    try {
      await axiosInstance.delete("/delete-parameter-non-compliance", {
        data,
        params: getAuthParams(),
      });
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 404) {
        console.warn("Несоответствие для удаления не найдено на сервере");
      }
      throw err;
    }
  },
};
