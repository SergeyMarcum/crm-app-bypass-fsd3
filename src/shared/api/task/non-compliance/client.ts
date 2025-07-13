// src/shared/api/task/non-compliance/client.ts
// ИСПРАВЛЕНИЕ: Изменен импорт с default на именованный экспорт 'api'
import { api } from "@/shared/api/axios"; // Импортируем именованный экспорт 'api'
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
      // ИСПРАВЛЕНИЕ: Используем 'api' вместо 'axiosInstance'
      const res = await api.get( // <-- ИЗМЕНЕНО
        "/all-cases-of-parameter-non-compliance",
        {
          params: {
            ...authParams,
            param_id: parameterId,
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