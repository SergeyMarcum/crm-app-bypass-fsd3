// src/shared/config/env.ts
export type EnvConfig = {
  API_URL: string;
};

export const CONFIG: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL,
};
