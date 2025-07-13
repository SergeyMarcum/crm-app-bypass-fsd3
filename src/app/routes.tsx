// src/app/routes.tsx
import { ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@features/auth/model/store";

import { DashboardLayout, LoginLayout } from "@widgets/layout";

import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { UsersPage } from "@/pages/users";
import { EmployeesPage } from "@/pages/employees";
import { TaskControlPage } from "@/pages/tasks/control";
import { CreateTaskPage } from "@/pages/tasks/create";
import { TaskViewPage } from "@/pages/tasks/view";
import { TaskPage } from "@/pages/task"; // 👈 Раскомментировано и обновлен путь
import { CalendarPage } from "@/pages/calendar";
import { HelpPage } from "@/pages/help";
import { SettingsPage } from "@/pages/settings";
import { CheckLogsPage } from "@/pages/logs/checks";
import { DefectLogsPage } from "@/pages/logs/defects";
import { ButtonsPage } from "@/pages/ui-kit/button";
import { ObjectsPage } from "@/pages/objects";
import { ObjectPage } from "@/pages/object";
import { ObjectTypePage } from "@/pages/object-type";
import { ParametersPage } from "@/pages/parameters";
import { ChatPage } from "@/pages/chat";
import { InstructionsPage } from "@/pages/instructions";

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

      <Route path="/ui-kit/buttons" element={<ButtonsPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}