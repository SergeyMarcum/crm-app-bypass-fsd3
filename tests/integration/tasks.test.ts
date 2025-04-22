// tests/integration/tasks.test.ts
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@shared/config/theme";
import { TaskControlPage } from "@pages/tasks/control";

const queryClient = new QueryClient();

test("renders task control page", () => {
  render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <TaskControlPage />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
  expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
});