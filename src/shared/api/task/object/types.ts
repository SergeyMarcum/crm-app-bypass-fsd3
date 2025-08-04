// src/shared/api/task/object/types.ts
import { NonComplianceCase } from "../non-compliance/types";

export interface ObjectItem {
  id: number;
  name: string;
  full_name?: string;
  address?: string;
  characteristics?: string;
}

export interface InspectionParameter {
  id: number; // ID параметра (генерируется или из API)
  name: string; // Название параметра
  type?: string; // Тип параметра, если предоставляется API
  nonCompliances?: NonComplianceCase[] | null; // Несоответствия, если есть
}

export interface GetObjectParametersResponse {
  object_info: {
    name: string;
    full_name: string | null;
    address: string;
    object_type_text: string | null;
    id: number;
    characteristic: string | null;
    object_type_id: number | null;
    domain: string;
  };
  object_type: unknown | null;
  parameters: { [key: string]: NonComplianceCase[] | null }[]; // Формат ответа /object/get
}

// Тип для ответа /parameters (предполагаемый формат)
export interface ParameterResponseItem {
  id?: number; // ID может отсутствовать, если API возвращает только имя
  name: string; // Название параметра
  type?: string; // Тип параметра, если есть
}
