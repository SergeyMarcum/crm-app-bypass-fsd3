// src/widgets/edit-parameter-modal/model/store.ts
import { create } from "zustand";
import { Incongruity } from "../types";

interface State {
  list: Incongruity[];
  set: (items: Incongruity[]) => void;
  add: (item: Incongruity) => void;
  remove: (id: number) => void;
  reset: () => void;
}

export const useEditIncongruityStore = create<State>((set) => ({
  list: [],
  set: (items) => set({ list: items }),
  add: (item) => set((state) => ({ list: [...state.list, item] })),
  remove: (id) =>
    set((state) => ({ list: state.list.filter((i) => i.id !== id) })),
  reset: () => set({ list: [] }),
}));
