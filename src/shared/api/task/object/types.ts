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
  id: number;
  name: string;
  type: string; // Например, 'Первичная' или 'Вторичная'
  // Добавьте другие поля, если API возвращает их
}

// Тип для ответа от /object/get, если он возвращает не только параметры, но и тип объекта
export interface GetObjectParametersResponse {
  object_type?: string; // Например, 'Автозаправочная станция'
  parameters: InspectionParameter[];
}
