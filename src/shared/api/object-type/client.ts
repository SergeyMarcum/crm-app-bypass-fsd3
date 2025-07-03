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
      const res = await axiosInstance.get(
        `/object-type-parameters${getAuthParams()}&id=${objectTypeId}`
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
      const res = await axiosInstance.get(
        `/all-object-types${getAuthParams()}`
      );
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Ошибка при получении всех типов объектов:", err.message);
      throw err;
    }
  },

  async getAllParameters(): Promise<ParameterOption[]> {
    const res = await axiosInstance.get(`/parameters${getAuthParams()}`);
    return res.data;
  },

  async getAllIncongruities(): Promise<Incongruity[]> {
    const res = await axiosInstance.get(
      `/cases-of-non-compliance${getAuthParams()}`
    );
    return res.data;
  },

  async saveObjectTypeParam(data: {
    id: number;
    name: string;
    parameter_ids: number[];
  }): Promise<void> {
    await axiosInstance.put(`/edit-object-type${getAuthParams()}`, data);
  },

  async editParameter(data: { id: number; name: string }): Promise<void> {
    await axiosInstance.put(`/edit-parameter${getAuthParams()}`, data);
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
    const res = await axiosInstance.get(
      `/all-cases-of-parameter-non-compliance${getAuthParams()}&param_id=${param_id}`
    );
    return res.data;
  },

  async addParameterIncongruity(data: {
    parameter_id: number;
    incongruity_ids: number[];
  }): Promise<void> {
    await axiosInstance.post(
      `/add-parameter-non-compliance${getAuthParams()}`,
      data
    );
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
    id: number;
    parameter_id: number;
    incongruity_ids: number;
  }): Promise<void> {
    await axiosInstance.delete(
      `/delete-parameter-non-compliance${getAuthParams()}`,
      {
        data,
      }
    );
  },
};
