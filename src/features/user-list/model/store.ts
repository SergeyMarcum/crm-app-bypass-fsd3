// src/features/user-list/model/store.ts
import { create } from "zustand";
import { User } from "@entities/user/types";

interface TableFilterState {
  [key: string]: string | undefined;
}

interface UserListState {
  users: User[];
  filters: TableFilterState;
  setUsers: (users: User[]) => void;
  setFilter: (field: string, value?: string) => void;
  resetFilters: () => void;
}

export const useTableStore = create<UserListState>((set) => ({
  users: [],
  filters: {},
  setUsers: (users: User[]) => set({ users }),
  setFilter: (field, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [field]: value,
      },
    })),
  resetFilters: () => set({ filters: {} }),
}));
