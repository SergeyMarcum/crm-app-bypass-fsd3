// src/features/auth/__tests__/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../ui/login-form";
import { useAuth } from "../hooks/use-auth";
import { MemoryRouter } from "react-router-dom";

jest.mock("../hooks/use-auth");

const mockUseAuth = useAuth as jest.Mock;

describe("LoginForm", () => {
  const mockDomains = [
    { id: "orenburg", name: "Оренбургский филиал" },
    { id: "irf", name: "Иркутский филиал" },
  ];

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      login: jest.fn().mockResolvedValue(undefined),
      fetchDomains: jest.fn(),
      domains: mockDomains,
      isLoading: false,
      isSessionChecking: false,
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
    expect(screen.getByLabelText("Запомнить меня")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      fetchDomains: jest.fn(),
      domains: mockDomains,
      isLoading: false,
      isSessionChecking: false,
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

    fireEvent.click(screen.getByText("Войти"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password",
        domain: "orenburg",
        rememberMe: false,
      });
    });
  });
});
