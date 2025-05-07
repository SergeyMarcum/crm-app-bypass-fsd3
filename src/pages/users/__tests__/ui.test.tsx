import { render, screen } from "@testing-library/react";
import UsersPage from "../ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

test("displays error when API fails", async () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <UsersPage />
    </QueryClientProvider>
  );
  // Мокаем ошибку API и проверяем отображение
});
