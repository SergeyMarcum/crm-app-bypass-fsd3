// src/widgets/object-history-table/types.ts

export type ObjectHistoryRecord = {
  id: number;
  inspection_date: string; // ISO format string
  is_reinspection: boolean;
  operator_full_name: string;
  upload_date: string; // ISO format string
  parameter: string;
  incongruity: string;
  photo_url: string;
};
