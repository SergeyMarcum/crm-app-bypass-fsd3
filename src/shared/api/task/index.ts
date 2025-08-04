// src/shared/api/task/index.ts
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import { AddNewTaskPayload } from "@features/tasks/task-form/model/task-schemas"; // Убедитесь, что путь корректен

export const taskApi = {
  /**
   * Добавляет новое задание.
   * @param payload Данные для создания нового задания.
   * @returns Ответ от сервера после успешного создания задания.
   */
  addNewTask: async (payload: AddNewTaskPayload) => {
    try {
      const response = await api.post("/add-new-task", payload, {
        params: getAuthParams(), // Предполагается, что API требует параметры авторизации
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании нового задания:", error);
      throw error; // Перебрасываем ошибку для дальнейшей обработки
    }
  },

  // Здесь могут быть добавлены другие методы API, связанные с задачами (например, получение, редактирование, удаление заданий)
};
