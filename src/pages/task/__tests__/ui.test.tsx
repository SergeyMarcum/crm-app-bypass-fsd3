// src/pages/task/__tests__/ui.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { TaskPage } from "../ui";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Use MemoryRouter for testing routes
import userEvent from '@testing-library/user-event';

// Mock the API calls
jest.mock("@/shared/api/task", () => ({
  taskApi: {
    getTaskDetails: jest.fn((taskId) =>
      Promise.resolve({
        id: taskId,
        checkStartTime: "2025-07-15T09:00:00",
        reportUploadDate: null,
        isRepeatCheck: false,
        lastCheckDate: null,
        status: "В процессе",
        object: {
          id: "obj-001",
          name: "Тестовый Объект",
          address: "Тестовый адрес",
          fullName: "Полное название тестового объекта",
          characteristics: "Тестовые характеристики.",
        },
        operator: {
          id: "op-001",
          fullName: "Тестовый Оператор",
          position: "Оператор",
          department: "Тест Отдел",
          email: "test@example.com",
          phone: "+7 (000) 000-00-00",
          avatarUrl: "https://via.placeholder.com/40",
        },
        checkParameters: [
          { id: 1, name: "Параметр 1", status: "Соответствует" },
        ],
        checkHistory: [
          { id: 1, checkDate: "2025-07-01", isRepeatCheck: false, operatorFullName: "Тест Оператор", comment: "Комментарий 1" },
        ],
        chatMessages: [
          { id: 1, senderId: "user-1", senderName: "Чат Пользователь", messageText: "Тестовое сообщение.", timestamp: "2025-07-15T09:05:00" },
        ],
      })
    ),
    downloadTaskXml: jest.fn(),
    uploadReport: jest.fn(),
    saveReportToDB: jest.fn(),
  },
}));

jest.mock("@/shared/api/chat", () => ({
    chatApi: {
      getMessages: jest.fn(), // Will be implicitly handled by taskApi.getTaskDetails mock
      sendMessage: jest.fn(() => Promise.resolve({
        id: 2, senderId: "current-user", senderName: "Текущий Пользователь",
        messageText: "Новое тестовое сообщение", timestamp: new Date().toISOString()
      })),
    },
}));


describe("TaskPage", () => {
  const renderWithRouter = (ui: React.ReactElement, { route = '/task/test-task-id' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/task/:taskId" element={ui} />
          <Route path="/" element={<div />} /> {/* For breadcrumbs root */}
          <Route path="/tasks/view" element={<div />} /> {/* For breadcrumbs parent */}
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders the page title and subtitle", async () => {
    renderWithRouter(<TaskPage />);
    expect(screen.getByText("Задание по проверке объекта")).toBeInTheDocument();
    expect(screen.getByText("Просмотр задания по проверке объекта филиала")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Тестовый Объект")).toBeInTheDocument();
    });
  });

  it("displays task details", async () => {
    renderWithRouter(<TaskPage />);
    await waitFor(() => {
      expect(screen.getByText(/Дата и время начала проверки:/i)).toBeInTheDocument();
      expect(screen.getByText(/Статус по заданию:/i)).toBeInTheDocument();
      expect(screen.getByText("Тестовый Объект")).toBeInTheDocument();
      expect(screen.getByText("Тестовый Оператор")).toBeInTheDocument();
    });
  });

  it("sends a chat message", async () => {
    renderWithRouter(<TaskPage />);
    await waitFor(() => {
        expect(screen.getByText("Тестовое сообщение.")).toBeInTheDocument();
    });

    const messageInput = screen.getByLabelText("Введите новое сообщение");
    const sendButton = screen.getByRole("button", { name: /отправить/i });

    await userEvent.type(messageInput, "Новое тестовое сообщение");
    await userEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Новое тестовое сообщение")).toBeInTheDocument();
    });
  });

  it("opens and closes the upload report modal", async () => {
    renderWithRouter(<TaskPage />);
    await waitFor(() => {
      expect(screen.getByText("Тестовый Объект")).toBeInTheDocument();
    });

    const uploadButton = screen.getByRole("button", { name: /загрузка отчета/i });
    await userEvent.click(uploadButton);

    expect(screen.getByText("Загрузка отчета (XML)")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i }); // Assuming IconButton renders with aria-label="close"
    await userEvent.click(closeButton);

    expect(screen.queryByText("Загрузка отчета (XML)")).not.toBeInTheDocument();
  });
});