// src/widgets/parameters/parameters-table/types.ts
export type Incongruity = {
  id: number;
  name: string;
};

export type ParamEditModalProps = {
  open: boolean;
  onClose: () => void;
  parameterId: number;
  parameterName: string;
};
