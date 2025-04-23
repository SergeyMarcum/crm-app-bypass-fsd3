// src/App.tsx
import * as React from "react";
import { AppRoutes } from "@app/routes";
import { AppInit } from "@app/init";

export function App(): React.ReactNode {
  console.log("Rendering App component");
  return (
    <AppInit>
      <AppRoutes />
    </AppInit>
  );
}
