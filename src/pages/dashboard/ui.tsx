// src/pages/dashboard/ui.tsx
import { PageContainer } from "@toolpad/core/PageContainer";
import { Typography } from "@mui/material";
import type { JSX } from "react";
import { AppButton } from "@/shared/ui/app-button";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

export const DashboardPage = (): JSX.Element => {
  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <AppButton
        type="withIcon"
        label="Сохранить"
        startIcon={<SaveIcon />}
        color="success"
        onClick={() => console.log("Clicked")}
      />

      <AppButton
        type="iconOnly"
        icon={<DeleteIcon />}
        color="error"
        onClick={() => console.log("Deleted")}
      />

      <AppButton
        type="group"
        buttons={[
          { type: "simple", label: "One" },
          { type: "simple", label: "Two" },
          { type: "simple", label: "Three" },
        ]}
      />
    </PageContainer>
  );
};
