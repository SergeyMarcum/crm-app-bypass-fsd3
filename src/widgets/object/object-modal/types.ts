// src/widgets/object-modal/types.ts

export type Parameter = {
  id: number;
  name: string;
};

export type ObjectType = {
  id: number;
  name: string;
};

export type ObjectModalProps = {
  open: boolean;
  onClose: () => void;
};
