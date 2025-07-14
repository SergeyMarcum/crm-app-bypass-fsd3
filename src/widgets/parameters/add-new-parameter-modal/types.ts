// src/widgets/parameters/add-new-parameter-modal/types.ts

export type ParameterOption = {
  id: number;
  name: string;
};

export type Incongruity = {
  id: number;
  name: string;
};

export type AddNewParameterModalProps = {
  open: boolean;
  onClose: () => void;
};
