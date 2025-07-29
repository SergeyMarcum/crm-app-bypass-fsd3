// src/app/routes/routes.tsx
import { ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@features/auth/model/store";

import { DashboardLayout, LoginLayout } from "@/app/layout";

import {
  CalendarPage,
  ChatPage,
  CheckLogsPage,
  DashboardPage,
  DefectLogsPage,
  EmployeesPage,
  HelpPage,
  InstructionsPage,
  LoginPage,
  ObjectPage,
  ObjectTypePage,
  ObjectsPage,
  ParametersPage,
  SettingsPage,
  TaskPage,
  CreateTaskPage,
  TaskControlPage,
  TaskViewPage,
  UsersPage,
} from "@/pages";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactElement;
  allowedRoles: number[];
}) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !allowedRoles.includes(user.role_id))
    return <Navigate to="/dashboard" replace />;
  return children;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<LoginLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

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
              <CreateTaskPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/view"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <TaskViewPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* НОВЫЙ МАРШРУТ для страницы "Задание" (Task detail) */}
      <Route
        path="/task/:taskId" // Это соответствует пути, используемому для навигации
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <TaskPage /> {/* Компонент страницы "Задание" */}
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

      <Route
        path="/objects"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <ObjectsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/objects/:id"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <ObjectPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/objects/types"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <ObjectTypePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/objects/parameters"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <DashboardLayout>
              <ParametersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <ChatPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructions"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <DashboardLayout>
              <InstructionsPage />
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
        path="/help"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3]}>
            <DashboardLayout>
              <HelpPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
