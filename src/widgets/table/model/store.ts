import { create } from "zustand";

export type TableFilterState = {
  email?: string;
  department?: string;
  phone?: string;
};

export type TableSortState = {
  field: string;
  direction: "asc" | "desc" | null;
};

interface TableStore {
  filters: TableFilterState;
  sort: TableSortState | null;
  resetFilters: () => void;
  setFilter: (field: keyof TableFilterState, value: string) => void;
  setSort: (sort: TableSortState) => void;
  clearSort: () => void;
}

export const useTableStore = create<TableStore>((set) => ({
  filters: {},
  sort: null,

  resetFilters: () => set({ filters: {} }),
  setFilter: (field, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [field]: value,
      },
    })),
  setSort: (sort) => set({ sort }),
  clearSort: () => set({ sort: null }),
}));
