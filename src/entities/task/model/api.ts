// src/entities/task/model/api.ts (для запроса)
import { api } from "shared/api"; // Предполагаем общий клиент API

export const getTaskDetails = async (taskId: string) => {
  const response = await api.get(`/task/get`, {
    params: {
      task_id: taskId,
      // Добавьте domain, username, session_code как требуется вашим API
    },
  });
  return response.data;
};
