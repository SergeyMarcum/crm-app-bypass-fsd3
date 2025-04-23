// src/features/auth/__tests__/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../ui/login-form";
import { useAuth } from "../hooks/use-auth";
import { MemoryRouter } from "react-router-dom";

jest.mock("../hooks/use-auth");

const mockUseAuth = useAuth as jest.Mock;

describe("LoginForm", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      handleLogin: jest.fn(),
      fetchDomains: jest.fn().mockResolvedValue({
        orenburg: "Оренбургский филиал",
        irf: "Иркутский филиал",
      }),
    });
  });

  it("renders login form", async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByText("Авторизация")).toBeInTheDocument();
    expect(screen.getByLabelText("Домен")).toBeInTheDocument();
    expect(screen.getByLabelText("Логин")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByLabelText("Запомни меня")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Оренбургский филиал")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const handleLogin = jest.fn();
    mockUseAuth.mockReturnValue({
      handleLogin,
      fetchDomains: jest.fn().mockResolvedValue({
        orenburg: "Оренбургский филиInvoker",
      }),
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Логин"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Домен"), {
      target: { value: "orenburg" },
    });
    fireEvent.click(screen.getByLabelText("Запомни меня"));
    fireEvent.click(screen.getByText("Войти"));

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password",
        domain: "orenburg",
      });
    });
  });
});
