// src/App.tsx
import { useAuthStore } from "@features/auth/model/store";
import { AppRoutes } from "@app/routes";
import { AppInit } from "@app/init";

export function App(): JSX.Element {
  const { isAuthenticated } = useAuthStore();
  return (
    <AppInit>
      {isAuthenticated ? <AppRoutes /> : <div>Please log in</div>}
    </AppInit>
  );
}
