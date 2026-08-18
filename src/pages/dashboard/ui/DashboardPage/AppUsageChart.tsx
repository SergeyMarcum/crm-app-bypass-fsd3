// src/pages/dashboard/ui/DashboardPage/AppUsageChart.tsx
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
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";

// Типизация пропсов
interface AppUsageChartProps {
  data: { month: string; thisYear: number; lastYear?: number }[];
  selectedYear: number;
  onPrevYear: () => void;
  onNextYear: () => void;
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
  selectedYear,
  onPrevYear,
  onNextYear,
  elevation = 3,
  borderRadius = 3,
}: AppUsageChartProps) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.dark;
  const secondaryColor = theme.palette.primary.light;

  return (
    <Card sx={{ borderRadius, boxShadow: elevation }}>
      <CardHeader
        title={`Проверка объектов за ${selectedYear} год`}
        action={
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1, mt: 0.5 }}>
            <IconButton onClick={onPrevYear} size="small" aria-label="Предыдущий год">
              <ChevronLeft />
            </IconButton>
            <Typography variant="body1" fontWeight="bold">
              {selectedYear}
            </Typography>
            <IconButton onClick={onNextYear} size="small" aria-label="Следующий год">
              <ChevronRight />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        {/* График и легенда */}
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barCategoryGap={0} barGap={-28}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis hide />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="thisYear"
                name="Проверено филиалом"
                fill={primaryColor}
                radius={[5, 5, 0, 0]}
                barSize={28}
              />
              <Bar
                dataKey="lastYear"
                name="Проверено сотрудником"
                fill={secondaryColor}
                radius={[5, 5, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <LegendBox sx={{ backgroundColor: primaryColor }} />
              <Typography variant="caption">
                Всего проверено объектов
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LegendBox sx={{ backgroundColor: secondaryColor }} />
              <Typography variant="caption">
                Всего проверено объектов данным сотрудником
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AppUsageChart;
