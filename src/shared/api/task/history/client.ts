// src/shared/api/task/history/client.ts
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import { AxiosError } from "axios";

export interface TaskHistoryItem {
  id: number;
  date_time: string;
  is_repeat_inspection: boolean;
  user_name: string | null;
  date_time_report_loading: string | null;
  parameters: { [key: string]: string[] | null };
}

export const taskHistoryApi = {
  async getObjectTasks(objectId: string): Promise<TaskHistoryItem[]> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/object-tasks", {
        params: { ...authParams, id: objectId },
      });
      return res.data;
    } catch (error) {
      handleAxiosError(`получении задач для объекта ${objectId}`, error);
    }
  },

  async getNonComplianceImage(nonCompId: string): Promise<string> {
    try {
      const authParams = getAuthParams();
      const res = await api.get("/report/non-comp-exemplar/get-one", {
        params: { ...authParams, id: nonCompId },
      });
      return res.data.image || "";
    } catch (error) {
      handleAxiosError(
        `получении изображения несоответствия ${nonCompId}`,
        error
      );
    }
  },
};

function handleAxiosError(context: string, error: unknown): never {
  const err = error as AxiosError;
  console.error(`Ошибка при ${context}:`, err.message);
  if (err.response?.data) {
    console.error("Детали ошибки от сервера:", err.response.data);
  }
  throw err;
}
