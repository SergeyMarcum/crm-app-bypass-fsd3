// src/pages/dashboard/ui.tsx
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Stack,
  CardHeader,
  Chip, // Импортируем Chip для статусов сотрудников
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, ArrowUp } from "@phosphor-icons/react"; // Импортируем Calendar из Phosphor Icons
import DomainIcon from "@mui/icons-material/Domain";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AppUsageChart from "./AppUsageChart";

interface DashboardData {
  metrics: {
    totalObjects: number; // Количество объектов
    checkedObjects: number; // Количество проверенных объектов
    objectsWithRemarks: number; // Количество объектов с замечаниями
  };
  chart: { month: string; thisYear: number; lastYear: number }[];
  employeeStats: {
    status: string;
    count: number;
    chipColor: "success" | "warning" | "error"; // Для цвета Chip
  }[];
  chat: { name: string; message: string; time: string }[];
  events: { date: string; time: string; title: string }[];
  currentTaskProgress: number; // Прогресс текущего задания
  currentTaskDescription: string; // Описание текущего задания
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
  { status: "На рабочем месте", count: 115, chipColor: "success" },
  { status: "Находятся в командировке", count: 3, chipColor: "warning" },
  {
    status: "Находятся на лечении в связи со временной нетрудоспособностью",
    count: 10,
    chipColor: "warning",
  },
  { status: "Находятся в отпуске", count: 15, chipColor: "warning" },
  { status: "Уволенные сотрудники", count: 4, chipColor: "error" },
];

const chatData: DashboardData["chat"] = [
  {
    name: "Мастер 1",
    message: "Здравствуйте, необходимо загрузить отчет до 01.04. Просьба не затягивать.",
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
    message: "Здравствуйте, необходимо проверить объект №2, есть вопросы по отчету.",
    time: "8 часов назад",
  },
];

const eventsData: DashboardData["events"] = [
  { date: "МАР 28", time: "08:00", title: "Проверка объекта №1" },
  { date: "МАР 31", time: "10:45", title: "Проверка объекта №2" },
  { date: "МАР 31", time: "23:30", title: "Проверка объекта №3" },
  { date: "АПР 3", time: "09:00", title: "Проверка объекта №4" },
];

const fetchDashboardData = async (): Promise<DashboardData> => {
  // В реальном приложении здесь будет запрос к API
  return {
    metrics: { totalObjects: 31, checkedObjects: 240, objectsWithRemarks: 21 },
    chart: chartData,
    employeeStats: employeeStats,
    chat: chatData,
    events: eventsData,
    currentTaskProgress: 80, // Прогресс
    currentTaskDescription: "Ожидается выгрузка отчета по проверке объекта №1", // Описание задания
  };
};

export function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    initialData: {
      metrics: { totalObjects: 31, checkedObjects: 240, objectsWithRemarks: 21 },
      chart: chartData,
      employeeStats: employeeStats,
      chat: chatData,
      events: eventsData,
      currentTaskProgress: 80,
      currentTaskDescription: "Ожидается выгрузка отчета по проверке объекта №1",
    },
  });

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

  const cardSx = { elevation: 3, borderRadius: 4, p: 2 };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minWidth: "1300px", // Учитываем минимальную ширину для десктопа
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      {/* 1. Блок краткой информации по проверке объектов */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Блок "Количество объектов" */}
        <Grid item xs={12} sm={4}>
          <Card sx={cardSx}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <DomainIcon
                  sx={{
                    boxShadow: 5,
                    width: 45,
                    height: 45,
                    p: 1,
                    borderRadius: 6,
                    color: "gray",
                  }}
                />
                <Stack>
                  <Typography variant="body1" color="text.secondary">
                    Общее количество объектов
                  </Typography>
                  <Typography variant="h4">
                    {data.metrics.totalObjects}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp size={16} color="green" />
                <Typography variant="body2" color="success.main">
                  +15% увеличение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Блок "Количество проверенных объектов" */}
        <Grid item xs={12} sm={4}>
          <Card sx={cardSx}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <AssignmentIcon
                  sx={{
                    boxShadow: 5,
                    width: 45,
                    height: 45,
                    p: 1,
                    borderRadius: 6,
                    color: "gray",
                  }}
                />
                <Stack>
                  <Typography variant="body1" color="text.secondary">
                    Количество проверенных объектов
                  </Typography>
                  <Typography variant="h4">
                    {data.metrics.checkedObjects}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp
                  size={16}
                  color="red"
                  style={{ transform: "rotate(180deg)" }} // Поворот для регресса
                />
                <Typography variant="body2" color="error.main">
                  -5% снижение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Блок "Количество объектов с замечаниями" */}
        <Grid item xs={12} sm={4}>
          <Card sx={cardSx}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <AssignmentLateIcon
                  sx={{
                    boxShadow: 5,
                    width: 45,
                    height: 45,
                    p: 1,
                    borderRadius: 6,
                    color: "gray",
                  }}
                />
                <Stack>
                  <Typography variant="body1" color="text.secondary">
                    Количество объектов с замечаниями
                  </Typography>
                  <Typography variant="h4">
                    {data.metrics.objectsWithRemarks}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp size={16} color="orange" />
                <Typography variant="body2" color="warning.main">
                  +12% увеличение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 2. График "Проверка объектов" и 3. Блок "Информация по сотрудникам" */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* График "Проверка объектов" */}
        <Grid item xs={12} md={8}>
          <AppUsageChart data={data.chart} elevation={4} borderRadius={4} />
        </Grid>

        {/* Блок "Информация по сотрудникам" */}
        <Grid item xs={12} md={4}>
          <Card sx={cardSx}>
            <CardHeader title="Информация по сотрудникам" />
            <CardContent>
              <List disablePadding> {/* disablePadding для устранения лишних отступов */}
                {data.employeeStats.map((emp, index) => (
                  <Box key={index}>
                    <ListItem disableGutters sx={{ py: 1 }}> {/* disableGutters и py для уменьшения отступов */}
                      <ListItemText
                        primary={emp.status}
                        primaryTypographyProps={{
                          fontWeight: "medium",
                          variant: "body1", // Более подходящий размер шрифта
                        }}
                      />
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" fontWeight="medium">
                          {emp.count}
                        </Typography>
                        <Chip label={emp.status.split(' ')[0]} color={emp.chipColor} size="small" /> {/* Используем первый слово как метку */}
                      </Stack>
                    </ListItem>
                    {index < data.employeeStats.length - 1 && (
                      <Divider variant="fullWidth" component="li" /> // Нижняя граница строки
                    )}
                  </Box>
                ))}
              </List>
              <Button
                variant="text"
                endIcon={<ArrowRight />}
                sx={{ mt: 2 }}
                onClick={() => console.log("Navigate to Employee List")} // TODO: Implement navigation
              >
                Список сотрудников
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 4. Блок "Последние сообщения", 5. Блок "План работы", 6. Блок "Статус текущего задания" */}
      <Grid container spacing={3}>
        {/* Блок "Последние сообщения" */}
        <Grid item xs={12} md={4}>
          <Card sx={cardSx}>
            <CardHeader title="Последние сообщения" />
            <CardContent>
              <List disablePadding>
                {data.chat.map((chat, index) => (
                  <Box key={index}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{ py: 1, cursor: "pointer" }} // Добавляем курсор для интерактивности
                      onClick={() => console.log(`Go to message from ${chat.name}`)} // TODO: Implement navigation to specific message
                    >
                      <ListItemAvatar>
                        <Avatar>{chat.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={chat.name}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{
                                display: 'block', // чтобы текст занимал отдельную строку
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%', // Ограничиваем ширину для ellipsis
                              }}
                            >
                              {chat.message.length > 50
                                ? `${chat.message.substring(0, 50)}...`
                                : chat.message}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5 }} // Небольшой отступ сверху
                            >
                              {chat.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < data.chat.length - 1 && <Divider component="li" variant="fullWidth" />}
                  </Box>
                ))}
              </List>
              <Button
                variant="text"
                endIcon={<ArrowRight />}
                sx={{ mt: 2 }}
                onClick={() => console.log("Go to chat page")} // TODO: Implement navigation
              >
                Подробнее...
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Блок "План работы" */}
        <Grid item xs={12} md={4}>
          <Card sx={cardSx}>
            <CardHeader title="План работы" />
            <CardContent>
              <List disablePadding>
                {data.events.map((event, index) => (
                  <Box key={index}>
                    <ListItem
                      sx={{ py: 1, cursor: "pointer" }}
                      onClick={() => console.log(`Go to event: ${event.title}`)} // TODO: Implement navigation to specific task
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          <Calendar size={24} /> {/* Используем Calendar из Phosphor Icons */}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            {event.date} / {event.time}
                          </Typography>
                        }
                        secondary={event.title}
                      />
                    </ListItem>
                    {index < data.events.length - 1 && <Divider component="li" variant="fullWidth" />}
                  </Box>
                ))}
              </List>
              <Button
                variant="text"
                endIcon={<ArrowRight />}
                sx={{ mt: 2 }}
                onClick={() => console.log("Go to task control page")} // TODO: Implement navigation
              >
                Подробнее...
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Блок "Статус текущего задания" */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...cardSx, textAlign: "center" }}>
            <CardHeader title="Статус текущего задания" />
            <CardContent>
              <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={data.currentTaskProgress}
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
                  <Typography variant="h6">{`${data.currentTaskProgress}%`}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {data.currentTaskDescription}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Текущее задание выполнено на {data.currentTaskProgress}%.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => console.log("Go to current task page")} // TODO: Implement navigation
              >
                Подробнее...
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;