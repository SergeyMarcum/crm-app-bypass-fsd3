// src/features/user-list/model/store.ts
import { create } from "zustand";
import { User } from "@entities/user/types";

interface UserListState {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useUserListStore = create<UserListState>((set) => ({
  users: [],
  setUsers: (users: User[]): void => set({ users }),
}));
