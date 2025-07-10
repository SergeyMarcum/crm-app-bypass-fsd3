// src/widgets/add-object-type-modal/types.ts

// Существующий тип Parameter
export interface Parameter {
  id: number;
  name: string;
}

// Новый тип для несоответствий
export interface NonCompliance {
  id: number;
  name: string;
}

// Интерфейс для начальных данных типа объекта при редактировании
export interface InitialObjectType {
  id: number;
  name: string;
  parameters: Parameter[]; // Параметры, уже привязанные к этому типу объекта
  // Добавьте сюда другие поля, если они требуются для отображения/редактирования
}

export interface AddObjectTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  initialObjectType?: InitialObjectType; // Сделан опциональным, чтобы поддерживать как добавление, так и редактирование
}
