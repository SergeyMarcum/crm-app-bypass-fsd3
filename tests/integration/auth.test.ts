// tests/integration/auth.test.ts
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@shared/config/theme";
import { LoginPage } from "@pages/login";

const queryClient = new QueryClient();

test("renders login page", () => {
  render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LoginPage />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});