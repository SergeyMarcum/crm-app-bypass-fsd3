// src/pages/employees/__tests__/ui.test.tsx
import { render, screen } from "@testing-library/react";
import { EmployeesPage } from "../ui";

describe("EmployeesPage", () => {
  it("renders the page title", () => {
    // В реальном тесте вам, возможно, потребуется мокать `userApi.getCompanyUsers`
    // и другие зависимости, чтобы избежать сетевых запросов.
    render(<EmployeesPage />);
    expect(screen.getByText("Список сотрудников")).toBeInTheDocument();
  });

  // Добавьте больше тестов здесь, например:
  // - Проверка наличия подзаголовка
  // - Проверка наличия вкладок
  // - Проверка наличия кнопок фильтров
  // - Проверка отображения таблицы (без конкретных столбцов)
  // - Тесты на фильтрацию и взаимодействие с UI
});