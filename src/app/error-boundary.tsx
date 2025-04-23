// src/app/error-boundary.tsx
import { Component, ReactNode } from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Что-то пошло не так
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Произошла ошибка. Пожалуйста, попробуйте снова.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Перезагрузить страницу
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
