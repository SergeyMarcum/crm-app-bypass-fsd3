// src/entities/instruction/types.ts
export interface InstructionCategory {
  id: number;
  name: string;
}

export interface InstructionCategoryPayload {
  id?: number;
  name: string;
}

export interface Instruction {
  id: number;
  category_id: number;
  user_id: number;
  adding_date: string;
  name: string;
  path: string;
}

export interface InstructionPayload {
  user_id: number | null;
  name: string | null;
  instruction_category_id: number | null;
  file: File | null;
}

export interface InstructionEditPayload {
  id: number;
  user_id: number | null;
  name: string | null;
  instruction_category_id: number | null;
}

export interface InstructionListParams {
  category_id: number;
}

// Тип для инструкции, который будет использоваться в UI
export interface UIInstruction {
  id: number;
  name: string;
  size: string;
  createdAt: string;
  creator: {
    avatar: string;
    fullName: string;
  };
  documentUrl: string;
  categoryId: number;
}
