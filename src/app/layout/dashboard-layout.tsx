// src/app/layout/dashboard-layout.tsx
import { ReactElement, useState } from "react";
import { Box } from "@mui/material";
import { Header } from "@widgets/header";
import { SidebarNav } from "@widgets/sidebar";

const APP_BAR_HEIGHT = 64; // Default height for AppBar

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps): ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header фиксирован сверху */}
      <Header onToggleSidebar={toggleSidebar} />

      <Box sx={{ display: "flex", flexGrow: 1, pt: `${APP_BAR_HEIGHT}px` }}>
        <SidebarNav isOpen={isSidebarOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "background.default",
            minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
