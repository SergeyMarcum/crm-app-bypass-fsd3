// src/pages/dashboard/ui.tsx
import { PageContainer } from "@toolpad/core/PageContainer";
import { Typography } from "@mui/material";
import type { JSX } from "react";

export const DashboardPage = (): JSX.Element => {
  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
    </PageContainer>
  );
};
