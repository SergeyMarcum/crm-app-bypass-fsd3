// src/entities/task/model/hooks.ts (для хука react-query)
import { useQuery } from "@tanstack/react-query";
import { getTaskDetails } from "./api";

export const useTaskDetails = (taskId: string) => {
  return useQuery({
    queryKey: ["taskDetails", taskId],
    queryFn: () => getTaskDetails(taskId),
    enabled: !!taskId, // Запрос будет выполнен только при наличии taskId
  });
};
