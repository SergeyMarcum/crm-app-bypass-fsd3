// src/widgets/layout/dashboard-layout.tsx
import { Box } from "@mui/material";
import { Header } from "@widgets/header";
import { Sidebar } from "@widgets/sidebar";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Box component="main" sx={{ p: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
