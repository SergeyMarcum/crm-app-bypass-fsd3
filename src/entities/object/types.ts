// src/entities/object/types.ts
export type DomainObject = {
  id: number;
  name: string;
  address: string;
  characteristic?: string;
  object_type?: number;
  type_name?: string;
  parameters?: number[];
  domain?: string;
};
