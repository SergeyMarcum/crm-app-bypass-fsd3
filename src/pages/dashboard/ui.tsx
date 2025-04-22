// src/pages/dashboard/ui.tsx
import { PageContainer } from "@toolpad/core/PageContainer";
import { Typography, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@shared/api/dashboard/client";
import { LineChart } from "@mui/x-charts/LineChart";

interface DashboardData {
  tasksCompleted: number;
  tasksPending: number;
  chartData: { month: string; value: number }[];
}

export const DashboardPage = (): JSX.Element => {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboardData,
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">
            Tasks Completed: {data?.tasksCompleted}
          </Typography>
          <Typography variant="h6">
            Tasks Pending: {data?.tasksPending}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <LineChart
            xAxis={[{ data: data?.chartData.map((d) => d.month) }]}
            series={[{ data: data?.chartData.map((d) => d.value) }]}
            height={300}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
};
