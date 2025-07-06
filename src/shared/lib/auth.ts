// src/shared/lib/auth.ts
export function getAuthParams(): Record<string, string> {
  return {
    domain: localStorage.getItem("auth_domain") || "",
    username: localStorage.getItem("username") || "",
    session_code: localStorage.getItem("session_token") || "",
  };
}
