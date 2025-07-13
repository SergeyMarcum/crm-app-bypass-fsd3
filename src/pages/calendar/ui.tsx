import { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
} from "@mui/material";
import { Calendar, dayjsLocalizer, View } from "react-big-calendar"; // Импортируем View
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "dayjs/locale/ru";
import { useCalendar } from "@/features/calendar";
import { Check } from "@/features/calendar/types";
import CheckModal from "./CheckModal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAuthStore } from "@/features/auth/model/store";
import { SelectChangeEvent } from "@mui/material/Select"; // Импорт SelectChangeEvent
import { ManipulateType } from "dayjs"; // Импорт ManipulateType из dayjs

dayjs.locale("ru");
const localizer = dayjsLocalizer(dayjs);

// Расширяем тип события календаря для включения данных о проверке
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: Check;
}

// ВРЕМЕННОЕ РЕШЕНИЕ: Определяем тип User здесь. В реальном проекте этот тип
// должен быть импортирован из 'src/features/auth/types.ts' или 'src/shared/types/user.ts'
interface AuthUser {
  login: string;
  system_login: string;
  full_name: string;
  position: string;
  email: string;
  role: "Admin" | "Operator" | "Guest" | "Manager" | string; // Добавлено свойство 'role'
}

const CalendarPage = () => {
  const {
    filters,
    setFilters,
    checks,
    isLoading,
    error,
    objects,
    operators,
    resetFilters,
  } = useCalendar();
  const { user } = useAuthStore() as { user: AuthUser | null }; // Приводим тип user

  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<View>("month"); // Явно указываем тип View
  const [date, setDate] = useState(new Date());

  const currentMonthYear = dayjs(date).format("MMMM YYYY");

  const events: CalendarEvent[] = useMemo(() => {
    if (isLoading || error) return [];
    return checks.map((check) => ({
      title: `${check.objectName} - ${check.operator.fullName}`,
      start: dayjs(check.startTime).toDate(),
      end: dayjs(check.startTime).add(1, "hour").toDate(),
      resource: check,
    }));
  }, [checks, isLoading, error]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedCheck(event.resource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCheck(null);
  };

  // ИСПРАВЛЕНИЕ: Указываем конкретный тип для event
  const handleFilterChange = (
    event: SelectChangeEvent<string | number>,
    type: "status" | "objectId" | "operatorId"
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type]: event.target.value === "" ? null : event.target.value,
    }));
  };

  // Кастомизация стилей событий
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#9e9e9e";
    let color = "white";

    switch (event.resource.status) {
      case "planned":
        backgroundColor = "#9e9e9e";
        break;
      case "pending":
        backgroundColor = "#ff9800";
        break;
      case "overdue":
        backgroundColor = "#d32f2f";
        break;
      case "completed":
        backgroundColor = "#4caf50";
        break;
      default:
        backgroundColor = "#9e9e9e";
    }

    return {
      style: {
        backgroundColor,
        color,
        borderRadius: "4px",
        border: "none",
        padding: "2px 8px",
        fontSize: "14px",
        cursor: "pointer",
        // ИСПРАВЛЕНИЕ: Приводим к React.CSSProperties['position']
        position: "relative" as React.CSSProperties["position"],
      },
    };
  };

  // ИСПРАВЛЕНИЕ: Добавляем проверку на 'agenda' и используем ManipulateType
  const goToBack = () => {
    if (view === "agenda") return;
    setDate((prev) => dayjs(prev).subtract(1, view as ManipulateType).toDate());
  };
  const goToNext = () => {
    if (view === "agenda") return;
    setDate((prev) => dayjs(prev).add(1, view as ManipulateType).toDate());
  };
  const goToToday = () => setDate(new Date());

  if (isLoading) return <Typography>Загрузка календаря...</Typography>;
  if (error) return <Typography color="error">Ошибка загрузки: {error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Календарь работ
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
        {currentMonthYear.charAt(0).toUpperCase() + currentMonthYear.slice(1)}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус проверки</InputLabel>
          <Select
            value={filters.status || "all"}
            label="Статус проверки"
            onChange={(e) => handleFilterChange(e, "status")}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="planned">Запланировано</MenuItem>
            <MenuItem value="pending">Ожидается загрузка отчета</MenuItem>
            <MenuItem value="overdue">Просрочено</MenuItem>
            <MenuItem value="completed">Проверено</MenuItem>
          </Select>
        </FormControl>

        {/* Фильтр по объектам: отображается всем, кроме Гостей */}
        {user?.role !== "Guest" && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Объекты</InputLabel>
            <Select
              value={filters.objectId || ""}
              label="Объекты"
              onChange={(e) => handleFilterChange(e, "objectId")}
            >
              <MenuItem value="">Все</MenuItem>
              {objects.map((obj) => (
                <MenuItem key={obj.id} value={obj.id}>
                  {obj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Фильтр по операторам: отображается всем, кроме Операторов и Гостей */}
        {user?.role !== "Operator" && user?.role !== "Guest" && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Операторы</InputLabel>
            <Select
              value={filters.operatorId || ""}
              label="Операторы"
              onChange={(e) => handleFilterChange(e, "operatorId")}
            >
              <MenuItem value="">Все</MenuItem>
              {operators.map((op) => (
                <MenuItem key={op.id} value={op.id}>
                  {op.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          variant="outlined"
          onClick={resetFilters}
          startIcon={<RestartAltIcon />}
          sx={{ height: 56 }}
        >
          Сбросить фильтры
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <IconButton onClick={goToBack}>
            <ArrowBackIcon />
          </IconButton>
          <Button onClick={goToToday}>Сегодня</Button>
          <IconButton onClick={goToNext}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        <Box>
          <Button
            variant={view === "month" ? "contained" : "outlined"}
            onClick={() => setView("month")}
            sx={{ mr: 1 }}
          >
            Месяц
          </Button>
          <Button
            variant={view === "week" ? "contained" : "outlined"}
            onClick={() => setView("week")}
            sx={{ mr: 1 }}
          >
            Неделя
          </Button>
          <Button
            variant={view === "day" ? "contained" : "outlined"}
            onClick={() => setView("day")}
            sx={{ mr: 1 }}
          >
            День
          </Button>
          <Button
            variant={view === "agenda" ? "contained" : "outlined"}
            onClick={() => setView("agenda")}
          >
            Повестка
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          view={view} // ИСПРАВЛЕНИЕ: Удаляем as any
          onView={(newView) => setView(newView)}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          messages={{
            allDay: "Весь день",
            previous: "Назад",
            next: "Вперед",
            today: "Сегодня",
            month: "Месяц",
            week: "Неделя",
            day: "День",
            agenda: "Повестка",
            date: "Дата",
            time: "Время",
            event: "Событие",
            noEventsInRange: "Нет событий в данном диапазоне.",
          }}
        />
      </Box>

      <CheckModal
        open={isModalOpen}
        onClose={handleCloseModal}
        check={selectedCheck}
      />
    </Box>
  );
};

export default CalendarPage;