import axios from "axios";
import type { AxiosResponse } from "axios";
import { useAuthStore } from "@/features/auth/model/store";

export interface ApiTask {
  id: number;
  date_time: string;
  date_for_search: string;
  comment: string | null;
  checking_type_text: string;
  object_name: string | null;
  manager_name: string | null;
  user_name: string | null;
  status_text: string;
}

export const getControlTasks = async (): Promise<ApiTask[]> => {
  try {
    const authStore = useAuthStore.getState();
    const domain = authStore.user?.domain;
    const username = authStore.user?.system_login;
    const session_code = authStore.token;

    if (!domain || !username || !session_code) {
      throw new Error("Аутентификационные данные отсутствуют");
    }

    const response: AxiosResponse<ApiTask[]> = await axios.get(
      "/api/domain-tasks",
      {
        params: { domain, username, session_code },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении заданий:", error);
    throw error;
  }
};
