// src/shared/api/calendar/client.ts
import { api, testApi } from "@/shared/api/axios";
// ИСПРАВЛЕНИЕ: Изменен путь импорта, чтобы он указывал на 'model/store'
import { useAuthStore } from "@/features/auth/model/store"; // <-- ИЗМЕНЕНО
import { CalendarFilter, Check, Object, Operator } from "@/features/calendar/types";

export const getChecks = async (filters: CalendarFilter): Promise<Check[]> => {
  const isTestMode = useAuthStore.getState().isTestMode;
  const client = isTestMode ? testApi : api;

  try {
    const response = await client.get("/checks", {
      params: {
        status: filters.status !== "all" ? filters.status : undefined,
        objectId: filters.objectId,
        operatorId: filters.operatorId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching checks:", error);
    throw new Error("Не удалось загрузить проверки");
  }
};

export const getObjects = async (): Promise<Object[]> => {
  const isTestMode = useAuthStore.getState().isTestMode;
  const client = isTestMode ? testApi : api;

  try {
    const response = await client.get("/all-domain-objects");
    return response.data;
  } catch (error) {
    console.error("Error fetching objects:", error);
    throw new Error("Не удалось загрузить объекты");
  }
};

export const getOperators = async (): Promise<Operator[]> => {
  const isTestMode = useAuthStore.getState().isTestMode;
  const client = isTestMode ? testApi : api;

  try {
    const response = await client.get("/operators");
    return response.data;
  } catch (error) {
    console.error("Error fetching operators:", error);
    throw new Error("Не удалось загрузить операторов");
  }
};