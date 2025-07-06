// src/shared/api/object/client.ts
import axiosInstance from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import type {
  DomainObject,
  ObjectDetail,
  ObjectTask,
} from "@/entities/object/types";
function getAuthQueryParams() {
  return {
    domain: localStorage.getItem("auth_domain") || "",
    username: localStorage.getItem("username") || "",
    session_code: localStorage.getItem("session_token") || "",
  };
}

export const objectApi = {
  async getAll(): Promise<DomainObject[]> {
    const res = await axiosInstance.get("/all-objects", {
      params: getAuthParams(),
    });
    return res.data;
  },

  async getAllTypes(): Promise<{ id: number; name: string }[]> {
    const res = await axiosInstance.get("/all-object-types", {
      params: getAuthParams(),
    });
    return res.data;
  },

  async getTypeParameters(
    typeId: number
  ): Promise<{ id: number; parameter: string }[]> {
    const res = await axiosInstance.get("/object-type-parameters", {
      params: {
        ...getAuthParams(),
        id: typeId,
      },
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
    await axiosInstance.post("/add-new-object", data, {
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
    await axiosInstance.put("/object/edit", data, {
      params: getAuthParams(),
    });
  },

  async getAllDomainObjects(): Promise<DomainObject[]> {
    const res = await axiosInstance.get("/all-domain-objects", {
      params: getAuthQueryParams(),
    });

    if (!Array.isArray(res.data)) {
      throw new Error("Ожидался массив объектов, получено: " + JSON.stringify(res.data));
    }

    return res.data;
  },

  async getById(objectId: number): Promise<ObjectDetail> {
    const res = await axiosInstance.get("/object/get", {
      params: {
        ...getAuthParams(),
        object_id: objectId,
      },
    });
    return res.data;
  },

  async getObjectTasks(objectId: number): Promise<ObjectTask[]> {
    const res = await axiosInstance.get("/object/tasks", {
      params: {
        ...getAuthParams(),
        object_id: objectId,
      },
    });
    return res.data;
  },
};
