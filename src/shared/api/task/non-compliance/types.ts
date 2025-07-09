// src/shared/api/task/non-compliance/types.ts
export interface NonComplianceCase {
  id: number;
  name: string;
  parameter_id: number; // Предполагаем, что несоответствия привязаны к параметру
  // Добавьте другие поля, если API возвращает их (например, description, code)
}
