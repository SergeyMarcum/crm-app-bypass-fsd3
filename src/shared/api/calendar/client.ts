// src/shared/api/calendar/client.ts
import { api } from "@/shared/api/axios";
import { getAuthParams } from "@/shared/lib/auth";

import type {
  //CalendarFilter,
  Check,
  Object,
  Operator,
  BackendCheck,
} from "@/features/calendar/types/types";

export const getChecks = async (): Promise<Check[]> => {
  try {
    const params = getAuthParams();
    const { data } = await api.get<BackendCheck[]>("/domain-tasks", { params });

    return data.map((check) => ({
      id: check.id,
      status: check.checking_type_text,
      startTime: check.date_time,
      objectName: check.object_name,
      objectId: check.object_id,
      domain: check.domain,
      operator: {
        id: check.user_id,
        fullName: check.user_name,
        // Аватарка здесь недоступна, оставим ее опциональной
      },
    }));
  } catch (error) {
    console.error("Error fetching checks:", error);
    throw new Error("Не удалось загрузить проверки");
  }
};

export const getObjects = async (): Promise<Object[]> => {
  try {
    const params = getAuthParams();
    const { data } = await api.get<BackendCheck[]>("/domain-tasks", { params });

    const uniqueObjects = new Map<number, Object>();
    data.forEach((check) => {
      if (check.object_id && !uniqueObjects.has(check.object_id)) {
        uniqueObjects.set(check.object_id, {
          id: check.object_id,
          name: check.object_name,
          domain: check.domain,
        });
      }
    });
    return Array.from(uniqueObjects.values());
  } catch (error) {
    console.error("Error fetching objects:", error);
    throw new Error("Не удалось загрузить объекты");
  }
};

export const getOperators = async (): Promise<Operator[]> => {
  try {
    const params = getAuthParams();
    const { data } = await api.get<BackendCheck[]>("/domain-tasks", { params });

    const uniqueOperators = new Map<number, Operator>();
    data.forEach((check) => {
      if (check.user_id && !uniqueOperators.has(check.user_id)) {
        uniqueOperators.set(check.user_id, {
          id: check.user_id,
          fullName: check.user_name,
          domain: check.domain,
        });
      }
    });
    return Array.from(uniqueOperators.values());
  } catch (error) {
    console.error("Error fetching operators:", error);
    throw new Error("Не удалось загрузить операторов");
  }
};
