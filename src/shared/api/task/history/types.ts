// src/shared/api/task/history/types.ts
export type TaskHistoryItem = {
  id: number;
  date_time: string; // Формат: YYYY-MM-DD HH:mm:ss
  is_repeat_inspection: boolean;
  user_name: string | null;
  date_time_report_loading: string | null;
  parameters: Record<string, string[] | null>; // Изменено на string[] | null
};
