// src/widgets/header/__tests__/ui.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../ui";
import { useUser } from "@shared/hooks/use-user";
import { useNotifications } from "@/app/stores/notifications/hooks/use-notifications";

jest.mock("@shared/hooks/use-user");
jest.mock("@/app/stores/notifications/hooks/use-notifications");

test("renders Header with user menu, search field and notifications", () => {
  (useUser as jest.Mock).mockReturnValue({
    user: {
      fullName: "Иванов Иван Иванович",
      name: "Иван",
      email: "ivanov@example.com",
      photo: null,
    },
    logout: jest.fn(),
  });
  (useNotifications as jest.Mock).mockReturnValue({ notifications: [{}] });

  render(
    <BrowserRouter>
      <Header onToggleSidebar={jest.fn()} />
    </BrowserRouter>
  );

  // Logo image check
  expect(screen.getByAltText("CRM App Logo")).toBeInTheDocument();

  // App Title check
  expect(screen.getByText("Обходчик")).toBeInTheDocument();

  // Search input checks
  expect(screen.getByPlaceholderText("Поиск...")).toBeInTheDocument();

  // Avatar text/initials checks (the "И" inside avatar and "Иванов И.И." text next to it)
  expect(screen.getByText("Иванов И.И.")).toBeInTheDocument();
  expect(screen.getByText("И")).toBeInTheDocument();

  // Click on user profile menu button
  fireEvent.click(screen.getByText("Иванов И.И."));

  // Check dropdown content
  expect(screen.getByText("Иванов Иван Иванович")).toBeInTheDocument();
  expect(screen.getByText("ivanov@example.com")).toBeInTheDocument();
  expect(screen.getByText("Профиль")).toBeInTheDocument();
  expect(screen.getByText("Выход")).toBeInTheDocument();
});

