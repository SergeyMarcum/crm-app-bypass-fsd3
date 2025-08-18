// src/shared/api/dashboard/client.ts
import { api } from "@/shared/api/axios";
import { z } from "zod";

const dashboardSchema = z.object({
  tasksCompleted: z.number(),
  tasksPending: z.number(),
  chartData: z.array(
    z.object({
      month: z.string(),
      value: z.number(),
    })
  ),
});

export const dashboardApi = {
  getDashboardData: async () => {
    const response = await api.get("/dashboard");
    return dashboardSchema.parse(response.data);
  },
};
