// src/features/tasks/task-form/api/task.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { AddNewTaskPayload } from "../model/task-schemas";
import dayjs from "dayjs"; 
/**
 * Хук для выполнения POST-запроса на добавление нового задания.
 * Использует `react-query` для управления состоянием мутации.
 */
export const useCreateTask = () => {
  return useMutation<object, Error, AddNewTaskPayload>({
    mutationFn: async (payload: AddNewTaskPayload) => {
      // Получаем значения из localStorage
      const domain = localStorage.getItem("auth_domain") || "";
      const username = localStorage.getItem("username") || "";
      const session_code = localStorage.getItem("session_token") || "";

      // **ВАЖНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ:** Форматируем дату и время
      const formattedPayload = {
        ...payload,
        date_time: payload.date_time ? dayjs(payload.date_time).format("YYYY-MM-DD HH:mm:ss") : "",
        date_time_previous_check: payload.date_time_previous_check
          ? dayjs(payload.date_time_previous_check).format("YYYY-MM-DD HH:mm:ss")
          : "",
      };

      const baseUrl = "http://192.168.0.185:82";
      // Обратите внимание: `/add-new-task` должен быть добавлен в прокси Vite,
      // как мы делали в предыдущем ответе, чтобы избежать ошибок CORS.
      const url = `${baseUrl}/add-new-task?domain=${domain}&username=${username}&session_code=${session_code}`;

      const response = await axios.post(url, formattedPayload); // Отправляем отформатированный payload
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Задание успешно создано!");
      console.log("Успешное создание задания:", data);
    },
    onError: (error) => {
      toast.error("Ошибка при создании задания.");
      console.error("Ошибка при создании задания:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Данные ошибки API:", error.response.data);
        toast.error(`Ошибка: ${error.response.data?.detail || error.message}`);
      } else {
        toast.error(`Сетевая ошибка: ${error.message}`);
      }
    },
  });
};

export const taskApi = {
  useCreateTask,
};