// src/widgets/add-parameter-modal/types.ts

export type ParameterOption = {
  id: number;
  name: string;
};

export type Incongruity = {
  id: number;
  name: string;
};

export type AddParameterModalProps = {
  open: boolean;
  onClose: () => void;
  objectTypeId: number; // добавлен ID типа объекта для привязки параметра
};
