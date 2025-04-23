// src/app/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store";
import { DashboardLayout, LoginLayout } from "@/widgets/layout";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { UsersPage } from "@/pages/users";
import { EmployeesPage } from "@/pages/employees";
import { TaskControlPage } from "@/pages/tasks/control";
import { TaskCreatePage } from "@/pages/tasks/create";
import { TaskViewPage } from "@/pages/tasks/view";
import { CalendarPage } from "@/pages/calendar";
import { HelpPage } from "@/pages/help";
import { SettingsPage } from "@/pages/settings";
import { CheckLogsPage } from "@/pages/logs/checks";
import { DefectLogsPage } from "@/pages/logs/defects";
import { Typography } from "@mui/material";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: number[];
}) => {
  const { isAuthenticated, user } = useAuthStore();
  console.log("ProtectedRoute check:", { isAuthenticated, user, allowedRoles });

  if (!isAuthenticated) {
    console.log("Redirecting to /login due to isAuthenticated=false");
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role_id)) {
    console.log(
      `Redirecting to /dashboard due to invalid role_id: ${user.role_id}`
    );
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginLayout>
            <LoginPage />
          </LoginLayout>
        }
      />
      <Route
        path="/debug"
        element={
          <Typography variant="h6">
            <pre>{JSON.stringify(useAuthStore.getState(), null, 2)}</pre>
          </Typography>
        }
      />
      {/* Остальные маршруты без изменений */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <UsersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <EmployeesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/control"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <TaskControlPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/create"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <TaskCreatePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/view/:id"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <TaskViewPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <CalendarPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <HelpPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs/checks"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <CheckLogsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs/defects"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <DefectLogsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
