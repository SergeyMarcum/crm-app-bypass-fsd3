// src/features/calendar/hooks/useCalendar.ts
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getChecks, getObjects, getOperators } from "@/shared/api/calendar";
import { CalendarFilter, Check, Object, Operator } from "../types/types";

export const useCalendar = () => {
  const [filters, setFilters] = useState<CalendarFilter>({
    status: "all",
    objectId: null,
    operatorId: null,
  });

  const checksQuery = useQuery<Check[], Error>({
    queryKey: ["checks"],
    queryFn: getChecks,
  });

  const objectsQuery = useQuery<Object[], Error>({
    queryKey: ["objects"],
    queryFn: getObjects,
  });

  const operatorsQuery = useQuery<Operator[], Error>({
    queryKey: ["operators"],
    queryFn: getOperators,
  });

  const filteredChecks = useMemo(() => {
    if (!checksQuery.data) return [];

    return checksQuery.data.filter((check) => {
      const statusMatch =
        filters.status === "all" || check.status === filters.status;
      const objectMatch =
        filters.objectId === null || check.objectId === filters.objectId;
      const operatorMatch =
        filters.operatorId === null || check.operator.id === filters.operatorId;

      return statusMatch && objectMatch && operatorMatch;
    });
  }, [checksQuery.data, filters]);

  const resetFilters = () => {
    setFilters({ status: "all", objectId: null, operatorId: null });
  };

  return {
    filters,
    setFilters,
    checks: filteredChecks,
    isLoading: checksQuery.isLoading,
    error: checksQuery.error?.message,
    objects: objectsQuery.data || [],
    operators: operatorsQuery.data || [],
    resetFilters,
  };
};
