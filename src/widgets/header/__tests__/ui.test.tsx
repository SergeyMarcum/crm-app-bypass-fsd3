// src/widgets/header/__tests__/ui.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../ui";
import { useUser } from "@shared/hooks/use-user";
import { useNotifications } from "@shared/processes/notifications/hooks/use-notifications";

jest.mock("@shared/hooks/use-user");
jest.mock("@shared/processes/notifications/hooks/use-notifications");

test("renders Header with user menu", () => {
  (useUser as jest.Mock).mockReturnValue({
    user: { name: "John Doe", email: "john@example.com", avatar: "" },
    logout: jest.fn(),
  });
  (useNotifications as jest.Mock).mockReturnValue({ notifications: [{}] });

  render(
    <BrowserRouter>
      <Header onToggleSidebar={jest.fn()} />
    </BrowserRouter>
  );

  expect(screen.getByText("CRM App")).toBeInTheDocument(); // Если используете текстовую заглушку Logo
  // Или expect(screen.getByAltText("CRM App Logo")).toBeInTheDocument(); если используете изображение
  expect(screen.getByText("JD")).toBeInTheDocument(); // Инициалы аватара
  fireEvent.click(screen.getByText("JD"));
  expect(screen.getByText("John Doe")).toBeInTheDocument();
  expect(screen.getByText("john@example.com")).toBeInTheDocument();
  expect(screen.getByText("Профиль")).toBeInTheDocument();
  expect(screen.getByText("Выход")).toBeInTheDocument();
});
