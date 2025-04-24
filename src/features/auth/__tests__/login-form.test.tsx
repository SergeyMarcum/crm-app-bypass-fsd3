// src/features/auth/__tests__/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../ui/login-form";
import { useAuth } from "../hooks/use-auth";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Мокаем хук useAuth
vi.mock("../hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

describe("LoginForm", () => {
  const mockUseAuth = {
    domains: [
      { id: "orenburg", name: "Оренбургский филиал (тестовый)" },
      { id: "irf", name: "Иркутский филиал" },
    ],
    isLoading: false,
    error: null,
    login: vi.fn(),
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
  });

  it("renders login form correctly", () => {
    render(<LoginForm />);
    expect(screen.getByText("Авторизация")).toBeInTheDocument();
    expect(screen.getByLabelText("Домен")).toBeInTheDocument();
    expect(screen.getByLabelText("Логин")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByLabelText("Запомни меня")).toBeInTheDocument();
    expect(screen.getByLabelText("Для тестирования")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    const loginMock = vi.fn();
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      login: loginMock,
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Логин"), {
      target: { value: "frontend" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "!QAZxsw2!@3" },
    });
    fireEvent.change(screen.getByLabelText("Домен"), {
      target: { value: "orenburg" },
    });
    fireEvent.click(screen.getByLabelText("Запомни меня"));

    fireEvent.click(screen.getByText("Войти"));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        username: "frontend",
        password: "!QAZxsw2!@3",
        domain: "orenburg",
        rememberMe: true,
      });
    });
  });
});
