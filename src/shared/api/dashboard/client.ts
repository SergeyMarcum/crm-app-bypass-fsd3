// src/shared/api/dashboard/client.ts
import { axios } from "../axios";
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
    const response = await axios.get("/dashboard");
    return dashboardSchema.parse(response.data);
  },
};
