// src/shared/api/instruction/client.ts
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import {
  InstructionCategory,
  InstructionCategoryPayload,
  Instruction,
  InstructionEditPayload,
} from "@/entities/instruction/types";

// Базовый URL для инструкций
const INSTRUCTION_BASE_URL = "/instruction";
const CATEGORY_BASE_URL = "/instruction/category";

export const instructionApi = {
  // Работа с категориями
  addCategory: async (payload: InstructionCategoryPayload) => {
    const response = await api.post(`${CATEGORY_BASE_URL}/add`, payload, {
      params: getAuthParams(),
    });
    return response.data;
  },

  editCategory: async (payload: InstructionCategoryPayload) => {
    const response = await api.put(`${CATEGORY_BASE_URL}/edit`, payload, {
      params: getAuthParams(),
    });
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`${CATEGORY_BASE_URL}/delete`, {
      data: { id },
      params: getAuthParams(),
    });
    return response.data;
  },

  getCategories: async (): Promise<InstructionCategory[]> => {
    const response = await api.get(`${CATEGORY_BASE_URL}/list`, {
      params: getAuthParams(),
    });
    return response.data;
  },

  // Работа с инструкциями
  addInstruction: async (formData: FormData) => {
    const response = await api.post(`${INSTRUCTION_BASE_URL}/add`, formData, {
      params: getAuthParams(),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getInstruction: async (instructionId: number): Promise<Instruction> => {
    const response = await api.get(`${INSTRUCTION_BASE_URL}/get`, {
      params: {
        ...getAuthParams(),
        instruction_id: instructionId,
      },
    });
    return response.data;
  },

  getInstructionsByCategory: async (
    categoryId: number
  ): Promise<Instruction[]> => {
    const response = await api.get(`${INSTRUCTION_BASE_URL}/list`, {
      params: {
        ...getAuthParams(),
        category_id: categoryId,
      },
    });
    return response.data;
  },

  editInstruction: async (payload: InstructionEditPayload) => {
    const response = await api.put(`${INSTRUCTION_BASE_URL}/edit`, payload, {
      params: getAuthParams(),
    });
    return response.data;
  },

  deleteInstruction: async (_id: number) => {
    // Поскольку в требованиях нет отдельного эндпоинта для удаления инструкций,
    // реализуем удаление через редактирование с установкой флага удаления
    // В реальной реализации здесь должен быть соответствующий эндпоинт
    throw new Error("Метод удаления инструкций не реализован в API");
  },
};
