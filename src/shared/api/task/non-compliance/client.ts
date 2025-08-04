// src/shared/api/task/non-compliance/client.ts
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import { AxiosError } from "axios";
import { NonComplianceCase } from "./types";

export const nonComplianceApi = {
  /**
   * Получает все несоответствия для определённого параметра.
   * @param parameterId ID параметра, для которого нужно получить несоответствия.
   * @returns Промис, возвращающий массив несоответствий `NonComplianceCase`.
   */
  async getAllCasesOfParameterNonCompliance(
    parameterId: string
  ): Promise<NonComplianceCase[]> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/all-cases-of-parameter-non-compliance", {
        params: {
          ...authParams,
          param_id: parameterId,
        },
      });
      return res.data;
    } catch (error) {
      return handleAxiosError(
        `получении несоответствий для параметра ${parameterId}`,
        error
      );
    }
  },

  /**
   * Получает список всех несоответствий.
   * @returns Промис, возвращающий массив несоответствий `NonComplianceCase`.
   */
  async getAllNonCompliances(): Promise<NonComplianceCase[]> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/cases-of-non-compliance", {
        params: authParams,
      });
      return res.data;
    } catch (error) {
      return handleAxiosError("получении всех несоответствий", error);
    }
  },

  /**
   * Добавляет несоответствия к параметру проверки для задачи.
   * @param taskId ID задачи.
   * @param paramsNonComps Объект, где ключи — ID параметров, а значения — массивы ID несоответствий.
   * @returns Промис, завершающийся без возвращаемого значения.
   */
  async addParameterNonCompliance(
    taskId: number,
    paramsNonComps: { [key: string]: number[] }
  ): Promise<void> {
    try {
      const authParams = getAuthParams();
      await api.post(
        "/task/add-parameters-and-non-compliances",
        { task_id: taskId, parameters: paramsNonComps },
        { params: authParams }
      );
    } catch (error) {
      return handleAxiosError("добавлении несоответствий параметра", error);
    }
  },
};

/**
 * Обработчик ошибок для запросов Axios.
 * @param context Контекст ошибки (описание действия).
 * @param error Объект ошибки.
 * @throws Ошибка Axios с дополнительной информацией.
 */
function handleAxiosError(context: string, error: unknown): never {
  const err = error as AxiosError;
  console.error(`Ошибка при ${context}:`, err.message);
  if (err.response?.data) {
    console.error("Детали ошибки от сервера:", err.response.data);
  }
  throw err;
}
