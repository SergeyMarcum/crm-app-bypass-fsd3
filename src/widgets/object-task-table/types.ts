// src/widgets/object-task-table/types.ts

export type ObjectTask = {
  id: number;
  check_date: string; // дата проверки
  is_recheck: boolean; // повторная проверка
  operator_name: string; // ФИО оператора
  upload_date: string; // дата загрузки отчета
  parameters: {
    id: number;
    name: string;
    incongruities: {
      id: number;
      name: string;
      photo_url?: string; // ссылка на фото (опционально)
    }[];
  }[];
};
