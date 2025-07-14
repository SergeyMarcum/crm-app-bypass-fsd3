// src/widgets/parameters/add-new-parameter-modal/model/store.ts
import { create } from "zustand";

import type { Incongruity } from "../types";

interface State {
  list: Incongruity[];
  set: (items: Incongruity[]) => void;
  add: (item: Incongruity) => void;
  remove: (id: number) => void;
  reset: () => void;
}

export const useAddNewParameterStore = create<State>((set) => ({
  list: [],
  set: (items) => set({ list: items }),
  add: (item) => set((state) => ({ list: [...state.list, item] })),
  remove: (id) =>
    set((state) => ({ list: state.list.filter((i) => i.id !== id) })),
  reset: () => set({ list: [] }),
}));
