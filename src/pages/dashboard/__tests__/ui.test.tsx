// src/pages/dashboard/__tests__/ui.test.tsx
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "../ui/DashboardPage/DashboardPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

jest.mock("recharts", () => {
  const original = jest.requireActual("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

jest.mock("@/shared/api/dashboard", () => ({
  dashboardApi: {
    getDashboardData: jest.fn().mockResolvedValue({
      metrics: {
        totalObjects: 31,
        checkedObjects: 240,
        objectsWithRemarks: 21,
      },
      employeeStats: [
        { status: "Работает", count: 115, chipColor: "success" },
        { status: "Командировка", count: 3, chipColor: "warning" },
        { status: "Больничный", count: 10, chipColor: "warning" },
        { status: "Отпуск", count: 15, chipColor: "warning" },
        { status: "Уволен(а)", count: 4, chipColor: "error" },
      ],
      rawTasks: [],
    }),
  },
}));

test("renders DashboardPage", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
    </QueryClientProvider>
  );
  expect(screen.getByText("Общее количество объектов")).toBeInTheDocument();
});
