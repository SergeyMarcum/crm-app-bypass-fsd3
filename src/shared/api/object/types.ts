// src/shared/api/object/types.ts
export interface ObjectItem {
  id: number;
  name: string;
  full_name?: string; // Добавлено на основе требований Шага 3
  address?: string; // Добавлено на основе требований Шага 3
  characteristics?: string; // Добавлено на основе требований Шага 3
}
