// src/features/tasks/task-form/api/task.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { AddNewTaskPayload } from "../model/task-schemas";

/**
 * Хук для выполнения POST-запроса на добавление нового задания.
 * Использует `react-query` для управления состоянием мутации.
 */
export const useCreateTask = () => {
  return useMutation<object, Error, AddNewTaskPayload>({
    mutationFn: async (payload: AddNewTaskPayload) => {
      // Получаем значения из localStorage
      const domain = localStorage.getItem("domain") || ""; // Замените "domain" на ключ, который вы используете
      const username = localStorage.getItem("username") || ""; // Замените "username" на ключ, который вы используете
      const session_code = localStorage.getItem("session_code") || ""; // Замените "session_code" на ключ, который вы используете

      const baseUrl = "http://192.168.1.243:82";
      const url = `${baseUrl}/add-new-task?domain=${domain}&username=${username}&session_code=${session_code}`;

      const response = await axios.post(url, payload);
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
      }
    },
  });
};

export const taskApi = {
  useCreateTask,
};
