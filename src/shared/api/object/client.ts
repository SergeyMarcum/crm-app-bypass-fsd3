// src/shared/api/object/client.ts
import axiosInstance from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import type { DomainObject } from "@/entities/object/types";

export const objectApi = {
  async getAll(): Promise<DomainObject[]> {
    const res = await axiosInstance.get(`/all-objects${getAuthParams()}`);
    return res.data;
  },

  async getAllTypes(): Promise<{ id: number; name: string }[]> {
    const res = await axiosInstance.get(`/all-object-types${getAuthParams()}`);
    return res.data;
  },

  async getTypeParameters(
    typeId: number
  ): Promise<{ id: number; parameter: string }[]> {
    const res = await axiosInstance.get(
      `/object-type-parameters${getAuthParams()}&id=${typeId}`
    );
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
    await axiosInstance.post(`/add-new-object${getAuthParams()}`, data);
  },

  async getAllDomainObjects(): Promise<DomainObject[]> {
    const res = await axiosInstance.get(
      `/all-domain-objects${getAuthParams()}`
    );
    return res.data;
  },
};
