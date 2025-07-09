// src/shared/api/task/non-compliance/client.ts
import axiosInstance from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import { NonComplianceCase } from "./types";
import { AxiosError } from "axios";

export const nonComplianceApi = {
  /**
   * Получает все несоответствия для определённого параметра.
   * @param parameterId ID параметра, для которого нужно получить несоответствия.
   */
  async getAllCasesOfParameterNonCompliance(
    parameterId: string
  ): Promise<NonComplianceCase[]> {
    try {
      const authParams = getAuthParams();
      const res = await axiosInstance.get(
        "/all-cases-of-parameter-non-compliance",
        {
          params: {
            ...authParams,
            parameter_id: parameterId, // Предполагаем, что API ожидает parameter_id
          },
        }
      );
      // Предполагаем, что API возвращает массив несоответствий напрямую
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error(
        `Ошибка при получении несоответствий для параметра ${parameterId}:`,
        err.message
      );
      if (err.response && err.response.data) {
        console.error("Детали ошибки от сервера:", err.response.data);
      }
      throw err;
    }
  },
};
