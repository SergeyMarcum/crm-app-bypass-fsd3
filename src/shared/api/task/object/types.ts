// src/shared/api/task/object/types.ts

export interface ObjectItem {
  id: number;
  name: string;
  full_name?: string;
  address?: string;
  characteristics?: string;
  // Добавьте другие поля объекта, если API возвращает их
}

// Новый тип для параметров проверки, возвращаемых /object/get
export interface InspectionParameter {
  id: number; // Убедитесь, что это `number`
  name: string;
  type: string; // Убедитесь, что это `string`
}

// Тип для ответа от /object/get, если он возвращает не только параметры, но и тип объекта
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
  // ИСПРАВЛЕНО: Теперь это массив InspectionParameter
  parameters: InspectionParameter[];
}