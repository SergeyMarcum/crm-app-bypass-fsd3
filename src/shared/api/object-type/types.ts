// src/shared/api/object-type/types.ts
export type IncongruityCase = {
  id: number; // ID связи
  incongruity_id: number;
  name: string;
};

/**
 * Интерфейс для параметра, возвращаемого общим API /parameters и /object-type-parameters.
 * Предполагается, что поле названия параметра называется 'name'.
 */
export interface Parameter {
  id: number;
  name: string;
}
