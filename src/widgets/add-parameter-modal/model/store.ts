// src/widgets/add-parameter-modal/model/store.ts
import { create } from "zustand";
import { Incongruity } from "../types";

interface State {
  selected: Incongruity[];
  add: (item: Incongruity) => void;
  remove: (id: number) => void;
  reset: () => void;
}

export const useIncongruityStore = create<State>((set) => ({
  selected: [],
  add: (item) =>
    set((state) => ({
      selected: [...state.selected, item],
    })),
  remove: (id) =>
    set((state) => ({
      selected: state.selected.filter((i) => i.id !== id),
    })),
  reset: () => set({ selected: [] }),
}));
