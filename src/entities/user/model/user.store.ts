// src/entities/user/model/user.store.ts
import { StateCreator } from "zustand";
import { User } from ".";
import { createWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { getProfile } from "../api";

export type UserState = {
  profile: User;
};

export type UserActions = {
  getProfile: () => void;
};

type createUserStoreType = StateCreator<
  UserState & UserActions,
  [["zustand/devtools", never]]
>;

const userSlice: createUserStoreType = (set) => ({
  profile: undefined,
  getProfile: async () => {
    // ... получение профиля
    const user = await getProfile();
    set({ profile: user });
  },
});

export const useUserStore = createWithEqualityFn<UserState & UserActions>()(
  devtools(userSlice, {
    name: "userStore",
  })
);
