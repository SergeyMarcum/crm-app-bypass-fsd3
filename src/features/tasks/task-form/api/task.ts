// src/features/tasks/task-form/api/task.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";
import {
  addNewTaskPayloadSchema,
  AddNewTaskPayload,
} from "../model/task-schemas";
import { AxiosError } from "axios";

export type CreateTaskResponse = {
  status: string;
  message: string;
  new_task_id: number;
};

/**
 * Хук для выполнения POST-запроса на добавление нового задания.
 * Использует `react-query` для управления состоянием мутации.
 */
export const useCreateTask = () => {
  return useMutation<
    CreateTaskResponse,
    AxiosError<{ detail: string | { loc: string[]; msg: string }[] }>,
    AddNewTaskPayload
  >({
    mutationFn: async (payload: AddNewTaskPayload) => {
      const params = getAuthParams();
      const validatedPayload = addNewTaskPayloadSchema.parse(payload);
      const response = await api.post("/add-new-task", validatedPayload, {
        params,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Задание успешно создано!");
      console.log("Успешное создание задания:", data);
    },
    onError: (error) => {
      console.error("Ошибка при создании задания:", error);
      if (error.response) {
        console.error("Данные ошибки API:", error.response.data);
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          const errorMessages = detail
            .map((item) => `${item.loc[1]}: ${item.msg}`)
            .join("; ");
          toast.error(`Ошибка валидации: ${errorMessages}`);
        } else if (typeof detail === "string") {
          toast.error(`Ошибка: ${detail}`);
        } else {
          toast.error(`Ошибка: ${error.message}`);
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
