// src/shared/api/object-type/client.ts
import axiosInstance from "@/shared/api/axios";
import type {
  Incongruity,
  ParameterOption,
} from "@/widgets/add-parameter-modal/types";

const DOMAIN = import.meta.env.VITE_DOMAIN;
const USERNAME = import.meta.env.VITE_USERNAME;
const SESSION = import.meta.env.VITE_SESSION;
const BASE = `?domain=${DOMAIN}&username=${USERNAME}&session_code=${SESSION}`;

export const objectTypeApi = {
  async getObjectTypeParameters(): Promise<
    { id: number; parameter: string }[]
  > {
    const res = await axiosInstance.get(`/object-type-parameters${BASE}&id=1`);
    console.log("getObjectTypeParameters response", res.data);
    if (!Array.isArray(res.data)) {
      throw new Error("Invalid response format: expected array");
    }
    return res.data.map((item: { id: number; name: string }) => ({
      id: item.id,
      parameter: item.name,
    }));
  },

  async getAllParameters(): Promise<ParameterOption[]> {
    const res = await axiosInstance.get(`/parameters${BASE}`);
    return res.data;
  },

  async getAllIncongruities(): Promise<Incongruity[]> {
    const res = await axiosInstance.get(`/cases-of-non-compliance${BASE}`);
    return res.data;
  },

  async saveObjectTypeParam(data: {
    id: number;
    name: string;
    parameter_ids: number[];
  }): Promise<void> {
    await axiosInstance.put(`/edit-object-type${BASE}`, data);
  },

  async editParameter(data: { id: number; name: string }): Promise<void> {
    await axiosInstance.put(`/edit-parameter${BASE}`, data);
  },

  async getParameterIncongruities(paramId: number): Promise<Incongruity[]> {
    const res = await axiosInstance.get(
      `/all-cases-of-parameter-non-compliance${BASE}&param_id=${paramId}`
    );
    return res.data;
  },

  async addParameterIncongruity(data: {
    id: number;
    parameter_id: number;
    incongruity_id: number;
  }): Promise<void> {
    await axiosInstance.put(`/edit-parameter-non-compliance${BASE}`, data);
  },

  async deleteParameterIncongruity(data: {
    id: number;
    parameter_id: number;
    incongruity_id: number;
  }): Promise<void> {
    await axiosInstance.delete(`/delete-parameter-non-compliance${BASE}`, {
      data,
    });
  },
};
