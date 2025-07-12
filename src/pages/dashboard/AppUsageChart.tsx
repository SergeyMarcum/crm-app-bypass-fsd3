// src/pages/dashboard/AppUsageChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";

// Типизация пропсов
interface AppUsageChartProps {
  data: { month: string; thisYear: number; lastYear?: number }[];
  elevation?: number;
  borderRadius?: number;
}

const LegendBox = styled(Box)({
  width: 16,
  height: 16,
  borderRadius: 4,
});

const AppUsageChart = ({
  data,
  elevation = 3,
  borderRadius = 3,
}: AppUsageChartProps) => {
  return (
    <Card sx={{ borderRadius, boxShadow: elevation }}>
      <CardHeader title="Проверка объектов" />
      <CardContent>
        <Stack direction="row" spacing={4}>
          {/* Левая часть: текст */}
          <Stack spacing={2} sx={{ maxWidth: "40%" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h2" color="green">
                +28%
              </Typography>
              <Typography variant="body1">
                идет рост проверок объектов на <b>12</b> больше аналогично
                предыдущему месяцу
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Просматривается положительная динамика роста проверки объектов
            </Typography>
          </Stack>

          {/* Правая часть: график и легенда */}
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} barCategoryGap={0} barGap={-28}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="thisYear"
                  fill="#4338CA"
                  radius={[5, 5, 0, 0]}
                  barSize={28}
                />
                <Bar
                  dataKey="lastYear"
                  fill="rgba(163, 191, 250, 0.6)"
                  radius={[5, 5, 0, 0]}
                  barSize={28}
                  // Удаляем position="insideLeft", так как оно не поддерживается
                />
              </BarChart>
            </ResponsiveContainer>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <LegendBox sx={{ backgroundColor: "#4338CA" }} />
                <Typography variant="caption">
                  Всего проверено объектов
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LegendBox
                  sx={{ backgroundColor: "rgba(163, 191, 250, 0.6)" }}
                />
                <Typography variant="caption">
                  Всего проверено объектов данным сотрудником
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AppUsageChart;