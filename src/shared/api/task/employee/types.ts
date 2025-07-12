// src/shared/api/task/employee/types.ts

/**
 * Роли сотрудников:
 * - 2: Администратор филиала
 * - 3: Мастер
 * - 4: Оператор
 */
export type EmployeeRole = 2 | 3 | 4;

export interface User {
  id: number;
  login: string;
  full_name: string | null;
  position: string | null;
  email: string | null;
  department: string | null;
  company: string | null;
  phone: string | null;
  address: string | null;
  photo: string | null;
  role_id: EmployeeRole;
}
