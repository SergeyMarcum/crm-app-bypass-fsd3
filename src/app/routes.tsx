// src/app/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@features/auth/model/store";

export const AppRoutes = () => {
  const { user, isAuthenticated } = useAuthStore();

  const isAdmin = user?.role_id === 1 || user?.role_id === 2;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/users"
        element={isAdmin ? <UsersPage /> : <Navigate to="/dashboard" />}
      />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
