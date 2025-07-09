// src/shared/api/parameter/types.ts

/**
 * Тип, представляющий общую структуру несоответствия.
 * Используется, например, для получения всех возможных несоответствий.
 */
export interface Incongruity {
  id: number;
  name: string;
}

/**
 * Тип, представляющий случай несоответствия, привязанный к параметру.
 * Может содержать дополнительные поля, специфичные для контекста параметра.
 */
export interface IncongruityCase {
  id: number;
  name: string;
  // Добавьте здесь любые другие поля, которые могут быть специфичны для несоответствия параметра
}

/**
 * Тип успешного ответа при добавлении нового параметра.
 */
export interface AddNewParameterSuccessResponse {
  id: number;
  message: string;
  parameter: {
    id: number;
    name: string;
    // Добавьте другие поля параметра, если они возвращаются при создании
  };
}
export interface ObjectParameter {
  id: number;
  parameter: string; // Имя параметра
}
