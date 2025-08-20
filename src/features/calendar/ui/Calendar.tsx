// src/features/calendar/ui/Calendar.tsx

import React, { useRef, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list"; // ИСПРАВЛЕНО: Добавлен импорт плагина
import { EventContentArg } from "@fullcalendar/core";
import ruLocale from "@fullcalendar/core/locales/ru";
import { Box, Button, CircularProgress, Alert } from "@mui/material";
import { useCalendar } from "@/features/calendar/hooks/useCalendar";
import { Check } from "@/features/calendar/types";
import { CheckEvent } from "./CheckEvent";

interface CalendarProps {
  onEventClick?: (check: Check) => void;
  checks: Check[]; // Добавлено: получение проверок из родителя
  isLoading: boolean; // Добавлено: состояние загрузки
  error?: string; // Добавлено: ошибка
}

export const Calendar: React.FC<CalendarProps> = (props) => {
  const { onEventClick, checks, isLoading, error } = props;
  const calendarRef = useRef<FullCalendar | null>(null);
  const [view, setView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek"
  >("dayGridMonth");

  const events = useMemo(() => {
    return checks.map((check: Check) => ({
      id: String(check.id),
      title: check.objectName,
      start: check.startTime,
      extendedProps: {
        check,
      },
    }));
  }, [checks]);

  const handleViewChange = (newView: typeof view) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDateNavigate = (action: "today" | "prev" | "next") => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (action === "today") {
        calendarApi.today();
      } else if (action === "prev") {
        calendarApi.prev();
      } else {
        calendarApi.next();
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Button
            variant={view === "dayGridMonth" ? "contained" : "outlined"}
            onClick={() => handleViewChange("dayGridMonth")}
            sx={{ mr: 1 }}
          >
            Месяц
          </Button>
          <Button
            variant={view === "timeGridWeek" ? "contained" : "outlined"}
            onClick={() => handleViewChange("timeGridWeek")}
            sx={{ mr: 1 }}
          >
            Неделя
          </Button>
          <Button
            variant={view === "timeGridDay" ? "contained" : "outlined"}
            onClick={() => handleViewChange("timeGridDay")}
            sx={{ mr: 1 }}
          >
            День
          </Button>
          <Button
            variant={view === "listWeek" ? "contained" : "outlined"}
            onClick={() => handleViewChange("listWeek")}
          >
            Повестка
          </Button>
        </Box>
        <Box>
          <Button
            variant="outlined"
            onClick={() => handleDateNavigate("today")}
            sx={{ mr: 1 }}
          >
            Сегодня
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDateNavigate("prev")}
            sx={{ mr: 1 }}
          >
            Назад
          </Button>
          <Button variant="outlined" onClick={() => handleDateNavigate("next")}>
            Вперед
          </Button>
        </Box>
      </Box>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        locale={ruLocale}
        headerToolbar={{
          left: "",
          center: "title",
          right: "",
        }}
        events={events}
        eventContent={(eventInfo: EventContentArg) => (
          <CheckEvent
            check={eventInfo.event.extendedProps.check}
            event={eventInfo}
          />
        )}
        eventClick={(info) => {
          if (onEventClick) {
            onEventClick(info.event.extendedProps.check);
          }
        }}
      />
    </Box>
  );
};
