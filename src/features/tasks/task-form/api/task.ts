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

      // Формируем payload, исключая пустые даты
      const formattedPayload: Partial<AddNewTaskPayload> = {
        ...payload,
      };

      if (payload.date_time) {
        formattedPayload.date_time = dayjs(payload.date_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        delete formattedPayload.date_time;
      }
      if (payload.date_time_previous_check) {
        formattedPayload.date_time_previous_check = dayjs(
          payload.date_time_previous_check
        ).format("YYYY-MM-DD HH:mm:ss");
      } else {
        delete formattedPayload.date_time_previous_check;
      }

      const url = `/api/add-new-task?domain=${domain}&username=${username}&session_code=${session_code}`;

      const response = await axios.post(url, formattedPayload);
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
        if (Array.isArray(error.response.data?.detail)) {
          toast.error(`Ошибка: ${error.response.data.detail[0].msg}`);
        } else {
          toast.error(`Ошибка: ${error.response.data?.detail || error.message}`);
        }
      } else {
        toast.error(`Сетевая ошибка: ${error.message}`);
      }
    },
  });
};

export const taskApi = {
  useCreateTask,
};
