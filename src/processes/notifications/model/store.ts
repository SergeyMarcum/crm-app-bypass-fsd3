// src/processes/notifications/model/store.ts
import { create } from "zustand";

interface NotificationState {
  notifications: { id: string; message: string }[];
  addNotification: (message: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (message) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now().toString(), message },
      ],
    })),
}));
