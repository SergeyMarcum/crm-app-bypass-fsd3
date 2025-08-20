import { Box, Typography } from "@mui/material";
import { Check } from "@/features/calendar/types";
import { EventContentArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";

interface CheckEventProps {
  check: Check;
  event: EventContentArg;
}

// Утилита для получения цвета линии в зависимости от статуса
const getStatusColor = (status: Check["status"]): string => {
  switch (status) {
    case "planned":
      return "#BA68C8"; // Серый: Ожидается проверка объекта
    case "downloaded":
      return "#4FC3F7"; // Синий: Задание скачано
    case "pending":
      return "#4FC3F7"; // Голубой: Ожидается загрузка отчёта
    case "completed":
      return "#81C784"; // Зеленый: Выполнено
    case "disadvantages":
      return "#FF8A65"; // Оранжевый: Выполнено, имеются недостатки
    case "overdue":
      return "#E57373"; // Красный: Задание не выполнено
    default:
      return "#635bff"; // Цвет по умолчанию
  }
};

export const CheckEvent: React.FC<CheckEventProps> = ({ check, event }) => {
  const lineColor = getStatusColor(check.status);
  const startTime = format(event.event.start!, "HH:mm", { locale: ru });
  const endTime = format(event.event.end!, "HH:mm", { locale: ru });

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        p: "4px",
        boxSizing: "border-box",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "4px",
      }}
    >
      {/* Цветная линия статуса */}
      <Box
        sx={{
          backgroundColor: lineColor,
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "4px",
        }}
      />

      {/* Основной контент */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          ml: "8px", // Отступ от линии
        }}
      >
        {/* Блок с временем */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.7rem",
            lineHeight: 1.2,
          }}
        >
          {startTime} — {endTime}
        </Typography>

        {/* Блок с объектом и оператором */}
        <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
          {/* Объект */}
          <Box display="flex" alignItems="center">
            <ApartmentIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
              {check.objectName}
            </Typography>
          </Box>

          {/* Оператор */}
          <Box display="flex" alignItems="center">
            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
              {check.operator.fullName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
