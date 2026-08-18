// src/shared/api/dashboard/client.ts
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";

export interface CalculatedDashboardData {
  metrics: {
    totalObjects: number;
    checkedObjects: number;
    objectsWithRemarks: number;
  };
  employeeStats: {
    status: string;
    count: number;
    chipColor: "success" | "warning" | "error";
  }[];
  rawTasks: any[];
}

export const dashboardApi = {
  getDashboardData: async (): Promise<CalculatedDashboardData> => {
    const params = getAuthParams();
    const domain = params.domain;

    // 1. Fetch domain objects
    const objectsResponse = await api.get("/all-domain-objects", { params });
    const objects = Array.isArray(objectsResponse.data) ? objectsResponse.data : [];
    const totalObjects = objects.length;

    // 2. Fetch domain tasks/checks
    const tasksResponse = await api.get("/domain-tasks", { params });
    const tasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : [];

    // Filter tasks where report is loaded (date_time_report_loading is not null)
    const checkedTasks = tasks.filter(
      (task: any) => task.date_time_report_loading !== null
    );
    const checkedObjectsCount = checkedTasks.length;

    // Filter checked tasks with remarks (checking_type_text is "disadvantages" or checking_type_id is 41)
    const tasksWithRemarksCount = checkedTasks.filter(
      (task: any) =>
        task.checking_type_text === "disadvantages" ||
        task.checking_type_id === 41
    ).length;

    // 3. Fetch company users
    const usersResponse = await api.get("/all-users-company", { params });
    const users =
      usersResponse.data && Array.isArray(usersResponse.data.users)
        ? usersResponse.data.users
        : [];

    // Filter users by domain to count branch employees
    const branchUsers = users.filter((u: any) => u.domain === domain);

    // Mappings:
    // 1 -> Работает (Works)
    // 2 -> Уволен(а) (Dismissed)
    // 3 -> Отпуск (Vacation)
    // 4 -> Командировка (Business Trip)
    // 5 -> Больничный (Sick Leave)
    // role_id === 7 also means Уволенные (Dismissed)
    const worksCount = branchUsers.filter((u: any) => u.status_id === 1).length;
    const businessTripCount = branchUsers.filter((u: any) => u.status_id === 4).length;
    const sickLeaveCount = branchUsers.filter((u: any) => u.status_id === 5).length;
    const vacationCount = branchUsers.filter((u: any) => u.status_id === 3).length;
    const dismissedCount = branchUsers.filter(
      (u: any) => u.status_id === 2 || u.role_id === 7
    ).length;

    return {
      metrics: {
        totalObjects,
        checkedObjects: checkedObjectsCount,
        objectsWithRemarks: tasksWithRemarksCount,
      },
      employeeStats: [
        { status: "Работает", count: worksCount, chipColor: "success" },
        { status: "Командировка", count: businessTripCount, chipColor: "warning" },
        { status: "Больничный", count: sickLeaveCount, chipColor: "warning" },
        { status: "Отпуск", count: vacationCount, chipColor: "warning" },
        { status: "Уволен(а)", count: dismissedCount, chipColor: "error" },
      ],
      rawTasks: tasks,
    };
  },
};
