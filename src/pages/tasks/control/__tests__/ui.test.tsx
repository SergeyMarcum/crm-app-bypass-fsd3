// src/pages/tasks/control/__tests__/ui.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { TaskControlPage } from "../ui";
import userEvent from '@testing-library/user-event'; // For simulating user interactions

// Mock the API call to avoid actual network requests during tests
jest.mock("@/shared/api/task", () => ({
  taskApi: {
    getControlTasks: jest.fn(() =>
      Promise.resolve({
        tasks: [
          {
            id: 1,
            checkDate: "2025-07-10",
            checkType: "Ежедневная",
            objectName: "ТЦ 'Центральный'",
            masterName: "Иванов И.И.",
            operatorName: "Петров П.П.",
            status: "Завершено",
            comment: "Все отлично",
            hasRemarks: false,
            objectId: "obj-001",
            operatorId: "op-001",
            createdAt: "2025-07-09",
          },
        ],
      })
    ),
  },
}));

describe("TaskControlPage", () => {
  it("renders the page title and subtitle", async () => {
    render(<TaskControlPage />);
    expect(screen.getByText("Контроль заданий по проверке объекта")).toBeInTheDocument();
    expect(screen.getByText("Список заданий по проверке объектов филиала")).toBeInTheDocument();

    // Wait for the mock API call to resolve and table to render
    await waitFor(() => {
      expect(screen.getByText("ТЦ 'Центральный'")).toBeInTheDocument();
    });
  });

  it("opens and closes the object filter modal", async () => {
    render(<TaskControlPage />);
    const objectButton = screen.getByRole("button", { name: /объекты/i });
    await userEvent.click(objectButton);
    expect(screen.getByText("Фильтрация по объектам")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /X/i });
    await userEvent.click(closeButton);
    expect(screen.queryByText("Фильтрация по объектам")).not.toBeInTheDocument();
  });

  // Add more tests for other filters, table content, navigation, etc.
});