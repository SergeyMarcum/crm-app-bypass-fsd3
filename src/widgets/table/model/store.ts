// src/widgets/table/model/store.ts
import { create } from "zustand";
import { storage } from "@/shared/lib/storage";

const FILTER_STORAGE_KEY = "table_filters";
const SORT_STORAGE_KEY = "table_sort";

// Загрузка фильтров и сортировки из localStorage (теперь через storage утилиту)
const loadFilters = (): Record<string, string> => {
  try {
    const raw = storage.get(FILTER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const loadSort = (): TableSortState | null => {
  try {
    const raw = storage.get(SORT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export type TableSortState = {
  field: string;
  direction: "asc" | "desc" | null;
};

interface TableStore {
  filters: Record<string, string>;
  sort: TableSortState | null;
  resetFilters: () => void;
  setFilter: (field: string, value: string) => void;
  setSort: (sort: TableSortState) => void;
  clearSort: () => void;
}

export const useTableStore = create<TableStore>((set) => ({
  filters: loadFilters(),
  sort: loadSort(),

  resetFilters: () => {
    storage.remove(FILTER_STORAGE_KEY);
    set({ filters: {} });
  },

  setFilter: (field, value) =>
    set((state) => {
      const newFilters = { ...state.filters, [field]: value };
      storage.set(FILTER_STORAGE_KEY, JSON.stringify(newFilters));
      return { filters: newFilters };
    }),

  setSort: (sort) => {
    storage.set(SORT_STORAGE_KEY, JSON.stringify(sort));
    set({ sort });
  },

  clearSort: () => {
    storage.remove(SORT_STORAGE_KEY);
    set({ sort: null });
  },
}));
