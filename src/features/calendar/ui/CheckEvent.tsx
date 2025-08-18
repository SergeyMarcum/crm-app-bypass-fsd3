// src/features/calendar/ui/CheckEvent.tsx
import { Box, Typography } from "@mui/material";
import { Check } from "@/features/calendar/types";
import { EventContentArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface CheckEventProps {
  check: Check;
  event: EventContentArg;
}

// Утилита для получения цвета фона в зависимости от статуса
const getStatusColor = (status: Check["status"]): string => {
  switch (status) {
    case "planned":
      return "#BA68C8"; // Secondary 300 (пурпурный)
    case "downloaded":
      return "#4FC3F7"; // Primary 300 (голубой)
    case "pending":
      return "#4FC3F7"; // Info 300 (голубой)
    case "completed":
      return "#81C784"; // Success 300 (зеленый)
    case "disadvantages":
      return "#FF8A65"; // Warning 300 (оранжевый)
    case "overdue":
      return "#E57373"; // Error 300 (красный)
    default:
      return "#635bff"; // Цвет по умолчанию
  }
};

export const CheckEvent: React.FC<CheckEventProps> = ({ check, event }) => {
  const backgroundColor = getStatusColor(check.status);

  // Форматируем время в "ЧЧ:ММ - ЧЧ:ММ"
  const eventTime = `${format(event.event.start!, "HH:mm", { locale: ru })}`;

  return (
    <Box
      sx={{
        backgroundColor: backgroundColor,
        color: "white",
        borderRadius: "4px",
        p: 0.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
        noWrap
      >
        {check.objectName}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: "0.7rem" }} noWrap>
        {eventTime}
      </Typography>
      <Typography variant="caption" sx={{ fontSize: "0.6rem" }} noWrap>
        {check.operator.fullName}
      </Typography>
    </Box>
  );
};
