// src/shared/lib/storage.ts
export const storage = {
  set: (key: string, value: string) => localStorage.setItem(key, value),
  get: (key: string) => localStorage.getItem(key),
  remove: (key: string) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};
