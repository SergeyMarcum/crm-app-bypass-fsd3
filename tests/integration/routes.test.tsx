// tests/integration/routes.test.tsx
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes";
import { useAuthStore } from "@/features/auth/model/store";

jest.mock("@features/auth/model/store");

describe("AppRoutes", () => {
  beforeEach(() => {
    (useAuthStore as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
  });

  it("redirects to login when not authenticated", async () => {
    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>,
      { initialEntries: ["/dashboard"] }
    );
    expect(screen.getByText(/авторизация/i)).toBeInTheDocument(); // Предполагается, что LoginPage содержит текст "Авторизация"
  });

  it("allows access to dashboard for authenticated user with correct role", async () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { username: "testuser", role_id: 1 },
    });

    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>,
      { initialEntries: ["/dashboard"] }
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument(); // Предполагается, что DashboardPage содержит текст "dashboard"
  });
});
