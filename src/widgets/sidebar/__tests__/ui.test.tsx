// src/widgets/sidebar/__tests__/ui.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SidebarNav } from "../ui";
import { useUser } from "@shared/hooks/use-user";

jest.mock("@shared/hooks/use-user");

test("renders Sidebar with navigation items", () => {
  (useUser as jest.Mock).mockReturnValue({ logout: jest.fn() });

  render(
    <BrowserRouter>
      <SidebarNav isOpen />
    </BrowserRouter>
  );

  expect(screen.getByText("Главная")).toBeInTheDocument();
  expect(screen.getByText("Календарь работ")).toBeInTheDocument();
  expect(screen.getByText("Задания")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Задания"));
  expect(screen.getByText("Создать")).toBeInTheDocument();
  expect(screen.getByText("Сотрудники")).toBeInTheDocument();
  expect(screen.getByText("Выход")).toBeInTheDocument();
});
