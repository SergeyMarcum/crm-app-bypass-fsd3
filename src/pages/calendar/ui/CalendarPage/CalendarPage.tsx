// src/pages/calendar/ui/CalendarPage/CalendarPage.tsx

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import {
  useCalendar,
  CalendarFilter,
  Object,
  Operator,
  Check,
} from "@/features/calendar";
import { Calendar } from "@/features/calendar/ui/Calendar";
import { CheckModal } from "../CheckModal/CheckModal";

export const CalendarPage: React.FC = () => {
  const {
    filters,
    setFilters,
    objects,
    operators,
    resetFilters,
    checks, // Получаем проверки из хука
    isLoading, // Состояние загрузки
    error, // Ошибки
  } = useCalendar();

  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFilterChange = (event: SelectChangeEvent<string | number>) => {
    const { name, value } = event.target;
    setFilters((prevFilters: CalendarFilter) => ({
      ...prevFilters,
      [name]: value === "all" || value === "" ? value : Number(value),
    }));
  };

  // Обработчик клика на событие календаря
  const handleEventClick = (check: Check) => {
    setSelectedCheck(check);
    setModalOpen(true);
  };

  // Закрытие модального окна
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCheck(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Календарь проверок
      </Typography>

      {/* Фильтры */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="status-filter-label">Статус</InputLabel>
          <Select
            labelId="status-filter-label"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            label="Статус"
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="planned">Ожидается проверка объекта</MenuItem>
            <MenuItem value="downloaded">Задание скачано</MenuItem>
            <MenuItem value="pending">Ожидается загрузка отчёта</MenuItem>
            <MenuItem value="overdue">Задание не выполнено</MenuItem>
            <MenuItem value="completed">Выполнено</MenuItem>
            <MenuItem value="disadvantages">
              Выполнено, имеются недостатки
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="object-filter-label">Объект</InputLabel>
          <Select<string | number>
            labelId="object-filter-label"
            name="objectId"
            value={filters.objectId ?? ""}
            onChange={handleFilterChange}
            label="Объект"
          >
            <MenuItem value="">Все объекты</MenuItem>
            {objects.map((obj: Object) => (
              <MenuItem key={obj.id} value={obj.id}>
                {obj.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="operator-filter-label">Оператор</InputLabel>
          <Select<string | number>
            labelId="operator-filter-label"
            name="operatorId"
            value={filters.operatorId ?? ""}
            onChange={handleFilterChange}
            label="Оператор"
          >
            <MenuItem value="">Все операторы</MenuItem>
            {operators.map((op: Operator) => (
              <MenuItem key={op.id} value={op.id}>
                {op.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={resetFilters}
          sx={{ alignSelf: "center" }}
        >
          Сбросить фильтры
        </Button>
      </Box>

      {/* Компонент календаря с обработчиком кликов */}
      <Calendar
        onEventClick={handleEventClick}
        checks={checks} // Передаём проверки в Calendar
        isLoading={isLoading} // Передаём состояние загрузки
        error={error} // Передаём ошибки
      />

      {/* Модальное окно с деталями проверки */}
      <CheckModal
        open={modalOpen}
        onClose={handleModalClose}
        check={selectedCheck}
      />
    </Container>
  );
};
