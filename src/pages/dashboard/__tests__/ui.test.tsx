// src/pages/dashboard/__tests__/ui.test.tsx
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "../ui/DashboardPage/DashboardPage";

test("renders DashboardPage", () => {
  render(<DashboardPage />);
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});
