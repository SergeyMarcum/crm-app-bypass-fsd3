// src/features/calendar/types/types.ts

/**
 * Интерфейс для фильтров, применяемых к календарю проверок.
 */
export interface CalendarFilter {
  status:
    | "all"
    | "planned"
    | "downloaded"
    | "pending"
    | "completed"
    | "disadvantages"
    | "overdue";
  objectId: number | null;
  operatorId: number | null;
}

/**
 * Интерфейс, представляющий собой одну проверку (событие в календаре).
 */
export interface Check {
  id: number;
  objectName: string;
  startTime: string;
  /**
   * Текущий статус проверки.
   * - "planned": Ожидается проверка объекта (серый) - т.е. status_id: 1
   * - "downloaded": Задание скачано (синий) - т.е. status_id: 2
   * - "pending": Ожидается загрузка отчёта (голубой) - т.е. status_id: 3
   * - "completed": Выполнено (зеленый) - т.е. status_id: 40
   * - "disadvantages": Выполнено, имеются недостатки (оранжевый) - т.е. status_id: 41
   * - "overdue": Задание не выполнено (красный) - т.е. status_id: 5
   */
  status:
    | "planned"
    | "downloaded"
    | "pending"
    | "completed"
    | "disadvantages"
    | "overdue"
    | string;
  operator: {
    id: number;
    fullName: string;
    avatar?: string;
  };
  objectId: number;
  domain: string;
}

/**
 * Интерфейс, представляющий объект для выбора в фильтрах.
 */
export interface Object {
  id: number;
  name: string;
  domain: string;
}

/**
 * Интерфейс, представляющий оператора для выбора в фильтрах.
 */
export interface Operator {
  id: number;
  fullName: string;
  avatar?: string;
  domain: string;
}

/**
 * Интерфейс для данных, возвращаемых эндпоинтом GET /domain-tasks.
 */
export interface BackendCheck {
  id: number;
  shift_id: number;
  checking_type_text: string;
  date_time: string;
  user_id: number;
  object_id: number;
  checking_type_id: number;
  domain: string;
  date_for_search: string;
  object_name: string;
  user_name: string;
  manager_email: string | null;
  user_email: string | null;
  manager_phone: string | null;
  date_time_report_loading: string | null;
  manager_department: string | null;
  date_time_previous_check: string | null;
  user_position: string | null;
  user_phone: string | null;
  user_department: string | null;
  object_full_name: string | null;
  manager_id: number | null;
  manager_name: string | null;
  manager_position: string | null;
  object_characteristic: string | null;
}
