// src/features/user-list/model/store.ts
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@shared/api/user/client";

interface UserListState {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useUserListStore = create<UserListState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));

export const useUserList = () => {
  const { setUsers } = useUserListStore();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await userApi.getUsers();
      setUsers(data);
      return data;
    },
  });
};
