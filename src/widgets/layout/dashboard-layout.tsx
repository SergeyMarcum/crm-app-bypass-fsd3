// src/widgets/layout/dashboard-layout.tsx
import { Box } from "@mui/material";
import { Header } from "@widgets/header";
import { Sidebar } from "@widgets/sidebar";
import { ReactNode } from "react";

export const DashboardLayout = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
