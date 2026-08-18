// src/shared/config/env.ts
export type EnvConfig = {
  API_URL: string;
  TEST_API_URL: string;
};

const getEnvVar = (key: string, fallback: string): string => {
  try {
    const metaObj = new Function("return import.meta")();
    return metaObj?.env?.[key] ?? fallback;
  } catch {
    return (typeof process !== "undefined" && process.env && process.env[key]) || fallback;
  }
};

export const CONFIG: EnvConfig = {
  API_URL: getEnvVar("VITE_API_URL", "http://192.168.1.240:82"),
  TEST_API_URL: getEnvVar("VITE_TEST_API_URL", "http://localhost:3001"),
};
