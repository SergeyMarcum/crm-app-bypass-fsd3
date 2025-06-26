// src/widgets/object-type-table/model/store.ts
import { create } from "zustand";
import type { ObjectParameter } from "../types";

interface ObjectTypeTableStore {
  data: ObjectParameter[];
  setData: (data: ObjectParameter[]) => void;
}

export const useObjectTypeTableStore = create<ObjectTypeTableStore>((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));
