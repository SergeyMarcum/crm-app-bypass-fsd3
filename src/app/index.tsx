// src/app/index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppInit } from "./init";
import { AppRoutes } from "./routes";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <AppInit>
      <AppRoutes />
    </AppInit>
  </StrictMode>
);
