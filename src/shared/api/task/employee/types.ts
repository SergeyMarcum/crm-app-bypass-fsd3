// src/shared/api/task/employee/types.ts
export interface User {
  id: number;
  login: string;
  full_name: string;
  position: string;
  email: string;
  department: string;
  company: string;
  phone: string;
  address: string;
  photo: string | null;
  role_id: number; // 4 для "Оператор"
}
