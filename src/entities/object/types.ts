// src/entities/object/types.ts

export type DomainObject = {
  id: number;
  name: string;
  address: string;
  characteristic?: string;
  object_type?: number;
  type_name?: string;
  parameters?: number[];
  domain?: string;
};

export type ObjectDetail = {
  id: number;
  name: string;
  full_name?: string;
  address: string;
  characteristic: string;
  object_type_text: string; // имя типа
  object_type_id: number; // для редактирования
  domain: string;
  parameters: { id: number }[]; // параметры для обновления
};

// Исправленный тип данных для ответа от API /object-tasks
export type ObjectTask = {
  id: number;
  date_time: string; // Используем date_time из ответа API
  date_time_report_loading: string | null; // Используем date_time_report_loading
  user_name: string; // Используем user_name
  checking_type_text: string; // Используем checking_type_text для определения повторности
  // Полей parameters и incongruities в ответе нет, поэтому их нет и в типе.
  // Также отсутствуют поля is_recheck, operator_name, upload_date
};

// Для таблицы истории — тип данных
export type ObjectHistoryRecord = {
  id: number;
  inspection_date: string;
  is_reinspection: boolean;
  operator_full_name: string;
  upload_date: string;
  parameter: string; // сгенерированная строка: все параметры
  incongruity: string; // сгенерированная строка: все несоответствия
};
