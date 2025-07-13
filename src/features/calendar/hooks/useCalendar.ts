// src/features/calendar/hooks/useCalendar.ts
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
// Обновленный импорт: теперь функции API берутся из shared/api/calendar
import { getChecks, getObjects, getOperators } from "@/shared/api/calendar";
import { CalendarFilter, Check, Object, Operator } from "../types";

export const useCalendar = () => {
  const [filters, setFilters] = useState<CalendarFilter>({
    status: "all",
    objectId: null,
    operatorId: null,
  });

  // Запрос для получения проверок с учетом текущих фильтров
  const checksQuery = useQuery<Check[], Error>({
    queryKey: ["checks", filters], // QueryKey включает фильтры для повторной выборки при их изменении
    queryFn: () => getChecks(filters),
  });

  // Запрос для получения списка объектов
  const objectsQuery = useQuery<Object[], Error>({
    queryKey: ["objects"],
    queryFn: getObjects,
  });

  // Запрос для получения списка операторов
  const operatorsQuery = useQuery<Operator[], Error>({
    queryKey: ["operators"],
    queryFn: getOperators,
  });

  // Функция для сброса фильтров к значениям по умолчанию
  const resetFilters = () => {
    setFilters({ status: "all", objectId: null, operatorId: null });
  };

  return {
    filters,
    setFilters,
    checks: checksQuery.data || [], // Возвращаем данные или пустой массив
    isLoading: checksQuery.isLoading,
    error: checksQuery.error?.message,
    objects: objectsQuery.data || [], // Возвращаем данные или пустой массив
    operators: operatorsQuery.data || [], // Возвращаем данные или пустой массив
    resetFilters,
  };
};