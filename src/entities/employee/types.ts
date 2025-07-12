// src/entities/employee/types.ts

export interface User {
  id: number;
  full_name?: string | null; // full_name может быть опциональным, строкой или null
  login?: string;
}