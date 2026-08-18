// src/pages/dashboard/ui/DashboardPage/DashboardPage.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "@phosphor-icons/react";
import DomainIcon from "@mui/icons-material/Domain";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AppUsageChart from "./AppUsageChart";
import { dashboardApi } from "@/shared/api/dashboard";
import { useAuthStore } from "@/features/auth/model/store";

interface DashboardData {
  metrics: {
    totalObjects: number;
    checkedObjects: number;
    objectsWithRemarks: number;
  };
  chart: { month: string; thisYear: number; lastYear: number }[];
  employeeStats: {
    status: string;
    count: number;
    chipColor: "success" | "warning" | "error";
  }[];
  chat: { name: string; message: string; time: string }[];
  events: { date: string; time: string; title: string }[];
  currentTaskProgress: number;
  currentTaskDescription: string;
}

const chartData: DashboardData["chart"] = [
  { month: "Янв", thisYear: 400, lastYear: 240 },
  { month: "Фев", thisYear: 300, lastYear: 139 },
  { month: "Мар", thisYear: 200, lastYear: 180 },
  { month: "Апр", thisYear: 278, lastYear: 90 },
  { month: "Май", thisYear: 189, lastYear: 110 },
  { month: "Июн", thisYear: 239, lastYear: 180 },
  { month: "Июл", thisYear: 349, lastYear: 230 },
  { month: "Авг", thisYear: 200, lastYear: 50 },
  { month: "Сен", thisYear: 278, lastYear: 190 },
  { month: "Окт", thisYear: 189, lastYear: 180 },
  { month: "Ноя", thisYear: 239, lastYear: 180 },
  { month: "Дек", thisYear: 349, lastYear: 130 },
];

const employeeStats: DashboardData["employeeStats"] = [
  { status: "Работает", count: 115, chipColor: "success" },
  { status: "Командировка", count: 3, chipColor: "warning" },
  {
    status: "Больничный",
    count: 10,
    chipColor: "warning",
  },
  { status: "Отпуск", count: 15, chipColor: "warning" },
  { status: "Уволен(а)", count: 4, chipColor: "error" },
];

const chatData: DashboardData["chat"] = [
  {
    name: "Мастер 1",
    message:
      "Здравствуйте, необходимо загрузить отчет до 01.04. Просьба не затягивать.",
    time: "2 мин. назад",
  },
  {
    name: "Мастер 1",
    message: "Здравствуйте, необходимо проверить объект №4 в ближайшее время.",
    time: "2 часа назад",
  },
  {
    name: "Мастер 2",
    message: "Здравствуйте, необходимо проверить объект №3, он очень срочный.",
    time: "3 часов назад",
  },
  {
    name: "Мастер 2",
    message:
      "Здравствуйте, необходимо проверить объект №2, есть вопросы по отчету.",
    time: "8 часов назад",
  },
];

const eventsData: DashboardData["events"] = [
  { date: "МАР 28", time: "08:00", title: "Проверка объекта №1" },
  { date: "МАР 31", time: "10:45", title: "Проверка объекта №2" },
  { date: "МАР 31", time: "23:30", title: "Проверка объекта №3" },
  { date: "АПР 3", time: "09:00", title: "Проверка объекта №4" },
];

const renderEmployeeStatusChip = (statusText: string) => {
  const text = statusText.trim().toLowerCase();

  if (text.includes("работает")) {
    return (
      <Chip
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#10B981" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        }
        label={statusText}
        variant="outlined"
        size="small"
        sx={{
          borderColor: "#A7F3D0",
          color: "#047857",
          backgroundColor: "#ECFDF5",
          fontWeight: 500,
          "& .MuiChip-label": { paddingLeft: "6px" },
        }}
      />
    );
  }

  if (text.includes("уволен")) {
    return (
      <Chip
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#EF4444" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        }
        label={statusText}
        variant="outlined"
        size="small"
        sx={{
          borderColor: "#FCA5A5",
          color: "#B91C1C",
          backgroundColor: "#FEF2F2",
          fontWeight: 500,
          "& .MuiChip-label": { paddingLeft: "6px" },
        }}
      />
    );
  }

  // Default warning status for vacation, sickness, trip
  return (
    <Chip
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#F59E0B" viewBox="0 0 256 256" style={{ marginLeft: 8 }}>
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"></path>
        </svg>
      }
      label={statusText}
      variant="outlined"
      size="small"
      sx={{
        borderColor: "#FDE68A",
        color: "#B45309",
        backgroundColor: "#FFFBEB",
        fontWeight: 500,
        "& .MuiChip-label": { paddingLeft: "6px" },
      }}
    />
  );
};

const formatTaskDate = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: "—", time: "—" };
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return { date: "—", time: "—" };
    const dateStr = date.toLocaleDateString("ru-RU", { month: "short", day: "numeric" }).toUpperCase();
    const timeStr = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    return { date: dateStr, time: timeStr };
  } catch {
    return { date: "—", time: "—" };
  }
};

interface DashboardQueryData extends Omit<DashboardData, "chart"> {
  rawTasks: any[];
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const currentUserId = user?.id || null;
  const currentUserName = user?.full_name || null;

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const { data, isLoading } = useQuery<DashboardQueryData>({
    queryKey: ["dashboardData"],
    queryFn: async (): Promise<DashboardQueryData> => {
      const realData = await dashboardApi.getDashboardData();
      return {
        metrics: realData.metrics,
        employeeStats: realData.employeeStats,
        chat: chatData,
        events: eventsData,
        currentTaskProgress: 80,
        currentTaskDescription: "Ожидается выгрузка отчета по проверке объекта №1",
        rawTasks: realData.rawTasks,
      };
    },
    initialData: {
      metrics: {
        totalObjects: 31,
        checkedObjects: 240,
        objectsWithRemarks: 21,
      },
      employeeStats: employeeStats,
      chat: chatData,
      events: eventsData,
      currentTaskProgress: 80,
      currentTaskDescription:
        "Ожидается выгрузка отчета по проверке объекта №1",
      rawTasks: [],
    },
  });

  const lastTask = useMemo(() => {
    if (!data || !data.rawTasks || data.rawTasks.length === 0) {
      return null;
    }
    // Filter tasks for the current user first
    const userTasks = data.rawTasks.filter((task: any) => {
      return (
        task.user_id === currentUserId ||
        (task.user_name && task.user_name === currentUserName)
      );
    });

    if (userTasks.length === 0) {
      return null;
    }

    // Filter active/current tasks (where report is not yet loaded)
    const activeTasks = userTasks.filter(
      (task: any) => task.date_time_report_loading === null
    );
    // Sort descending by id to get the latest task
    if (activeTasks.length > 0) {
      return [...activeTasks].sort((a, b) => b.id - a.id)[0];
    }
    // Fallback to the latest task overall for this user if no active tasks
    return [...userTasks].sort((a, b) => b.id - a.id)[0];
  }, [data, currentUserId, currentUserName]);

  const currentTaskProgress = useMemo(() => {
    if (!lastTask) return 0;
    if (
      lastTask.date_time_report_loading !== null ||
      (lastTask.status_text &&
        (lastTask.status_text.toLowerCase().includes("выполн") ||
          lastTask.status_text.toLowerCase().includes("заверш")))
    ) {
      return 100;
    }
    return 50; // In progress task is 50%
  }, [lastTask]);

  const currentTaskDescription = useMemo(() => {
    if (!lastTask) return "Нет текущих заданий";
    const objName = lastTask.object_name || "—";
    const checkType = lastTask.checking_type_text || "Проверка";
    const status = lastTask.status_text || "В процессе";
    return `Задание №${lastTask.id} по проверке объекта "${objName}" (${checkType}). Статус: ${status}`;
  }, [lastTask]);

  const userPlanTasks = useMemo(() => {
    if (!data || !data.rawTasks || data.rawTasks.length === 0) {
      return [];
    }

    // Filter for current user and no report loaded
    const filtered = data.rawTasks.filter((task: any) => {
      const isUser =
        task.user_id === currentUserId ||
        (task.user_name && task.user_name === currentUserName);
      const noReport = task.date_time_report_loading === null;
      return isUser && noReport;
    });

    // Sort descending by id
    const sorted = [...filtered].sort((a, b) => b.id - a.id);

    // Map to structure for Plan
    return sorted.map((task: any) => {
      const { date, time } = formatTaskDate(task.date_time);
      const title = `Проверка объекта "${task.object_name || "—"}" (${task.checking_type_text || "Проверка"})`;
      return {
        id: task.id,
        date,
        time,
        title,
      };
    });
  }, [data, currentUserId, currentUserName]);

  const userHasTasks = useMemo(() => {
    if (!data || !data.rawTasks || data.rawTasks.length === 0) {
      return false;
    }
    return data.rawTasks.some((task: any) => {
      return (
        task.user_id === currentUserId ||
        (task.user_name && task.user_name === currentUserName)
      );
    });
  }, [data, currentUserId, currentUserName]);

  const computedChartData = useMemo(() => {
    if (!data || !data.rawTasks || data.rawTasks.length === 0) {
      return chartData;
    }

    const monthsList = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

    const isTaskChecked = (task: any) => {
      return (
        task.date_time_report_loading !== null ||
        task.checking_type_text === "completed" ||
        task.checking_type_text === "disadvantages" ||
        task.checking_type_id === 40 ||
        task.checking_type_id === 41
      );
    };

    const getTaskDateStr = (task: any) => {
      return task.date_time_report_loading || task.date_time;
    };

    return monthsList.map((monthName, monthIndex) => {
      const domainChecksInMonth = data.rawTasks.filter((task: any) => {
        if (!isTaskChecked(task)) return false;
        const dateStr = getTaskDateStr(task);
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date.getFullYear() === selectedYear && date.getMonth() === monthIndex;
      });

      const employeeChecksInMonth = domainChecksInMonth.filter((task: any) => {
        return (
          task.user_id === currentUserId ||
          (task.user_name && task.user_name === currentUserName)
        );
      });

      return {
        month: monthName,
        thisYear: domainChecksInMonth.length,
        lastYear: employeeChecksInMonth.length,
      };
    });
  }, [data, selectedYear, currentUserId, currentUserName]);

  const handlePrevYear = () => {
    setSelectedYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setSelectedYear((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Загрузка данных...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minWidth: "1300px",
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      {/* 1. Блок краткой информации по проверке объектов */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Блок "Количество объектов" */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 8,
                    width: 48,
                    height: 48,
                  }}
                >
                  <DomainIcon
                    sx={{ fontSize: "1.5rem", color: "text.primary" }}
                  />
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    Общее количество объектов
                  </Typography>
                  <Typography variant="h3">
                    {data.metrics.totalObjects}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Блок "Количество проверенных объектов" */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 8,
                    width: 48,
                    height: 48,
                  }}
                >
                  <AssignmentIcon
                    sx={{ fontSize: "1.5rem", color: "text.primary" }}
                  />
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    Количество проверенных объектов
                  </Typography>
                  <Typography variant="h3">
                    {data.metrics.checkedObjects}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Блок "Количество объектов с замечаниями" */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 8,
                    width: 48,
                    height: 48,
                  }}
                >
                  <AssignmentLateIcon
                    sx={{ fontSize: "1.5rem", color: "text.primary" }}
                  />
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    Количество объектов с замечаниями
                  </Typography>
                  <Typography variant="h3">
                    {data.metrics.objectsWithRemarks}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 2. График "Проверка объектов" и 3. Блок "Информация по сотрудникам" */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* График "Проверка объектов" */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AppUsageChart
            data={computedChartData}
            selectedYear={selectedYear}
            onPrevYear={handlePrevYear}
            onNextYear={handleNextYear}
          />
        </Grid>

        {/* Блок "Информация по сотрудникам" */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Информация по сотрудникам" />
            <CardContent>
              <List disablePadding>
                {data.employeeStats.map((emp, index) => (
                  <Box key={index}>
                    <ListItem
                      disableGutters
                      sx={{
                        py: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {renderEmployeeStatusChip(emp.status)}
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ color: "#101828" }}
                      >
                        {emp.count}
                      </Typography>
                    </ListItem>
                    {index < data.employeeStats.length - 1 && (
                      <Divider component="li" variant="fullWidth" />
                    )}
                  </Box>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button
                variant="text"
                color="secondary"
                size="small"
                endIcon={<ArrowRight />}
                onClick={() => console.log("Navigate to Employee List")}
              >
                Список сотрудников
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* 4. Блок "План работы", 5. Блок "Статус текущего задания" */}
      {userHasTasks && (
        <Grid container spacing={3}>
          {/* Блок "План работы" */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="План работы" />
              <CardContent>
                <List disablePadding>
                  {userPlanTasks.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ py: 3 }}
                    >
                      Нет запланированных заданий без отчетов
                    </Typography>
                  ) : (
                    userPlanTasks.map((task, index) => (
                      <Box key={task.id}>
                        <ListItem
                          sx={{ py: 1, cursor: "pointer" }}
                          onClick={() => navigate(`/task/${task.id}`)}
                        >
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            <AssignmentIcon sx={{ color: "#475467" }} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                {task.date} / {task.time}
                              </Typography>
                            }
                            secondary={task.title}
                          />
                        </ListItem>
                        {index < userPlanTasks.length - 1 && (
                          <Divider component="li" variant="fullWidth" />
                        )}
                      </Box>
                    ))
                  )}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  endIcon={<ArrowRight />}
                  onClick={() => navigate("/tasks/control")}
                >
                  Подробнее...
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Блок "Статус текущего задания" */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="Статус текущего задания" />
              <CardContent>
                <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={currentTaskProgress}
                    size={100}
                    thickness={5}
                    sx={{ color: "primary.main" }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6">{`${currentTaskProgress}%`}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {currentTaskDescription}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Текущее задание выполнено на {currentTaskProgress}%.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  endIcon={<ArrowRight />}
                  onClick={() => navigate("/tasks/control")}
                >
                  Подробнее...
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default DashboardPage;
