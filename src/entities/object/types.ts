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
  object_type: string; // имя типа
  object_type_id: number; // для редактирования
  domain: string;
  parameters: { id: number }[]; // параметры для обновления
};

export type ObjectTask = {
  id: number;
  check_date: string;
  is_recheck: boolean;
  operator_name: string;
  upload_date: string;
  parameters: {
    id: number;
    name: string;
    incongruities: {
      id: number;
      name: string;
      photo_url?: string;
    }[];
  }[];
};

// Для таблицы истории — тип данных
export type ObjectHistoryRecord = {
  id: number;
  check_date: string;
  is_recheck: boolean;
  operator_name: string;
  upload_date: string;
  parameter_summary: string; // сгенерированная строка: все параметры
  incongruity_summary: string; // сгенерированная строка: все несоответствия
};
