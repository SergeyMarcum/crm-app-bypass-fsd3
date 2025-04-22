// src/widgets/layout/dashboard-layout.tsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import { Header } from "@widgets/header";
import { SidebarNav } from "@widgets/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SidebarNav isOpen={isSidebarOpen} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header onToggleSidebar={toggleSidebar} />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, bgcolor: "background.default" }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
