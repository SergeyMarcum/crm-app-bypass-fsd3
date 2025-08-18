// src/pages/calendar/ui/CalendarPage/CalendarPage.tsx

import React from "react";
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
} from "@/features/calendar";
import { Calendar } from "@/features/calendar/ui/Calendar";

export const CalendarPage: React.FC = () => {
  const { filters, setFilters, objects, operators, resetFilters } =
    useCalendar();

  // ИСПРАВЛЕНО: Обновляем тип event, чтобы он мог принимать string | number
  const handleFilterChange = (event: SelectChangeEvent<string | number>) => {
    const { name, value } = event.target;
    setFilters((prevFilters: CalendarFilter) => ({
      ...prevFilters,
      [name]: value === "all" || value === "" ? value : Number(value),
    }));
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
            <MenuItem value="planned">Запланировано</MenuItem>
            <MenuItem value="pending">Ожидается</MenuItem>
            <MenuItem value="overdue">Просрочено</MenuItem>
            <MenuItem value="completed">Проверено</MenuItem>
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

      {/* Компонент календаря */}
      <Calendar />
    </Container>
  );
};
