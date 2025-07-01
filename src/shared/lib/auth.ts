// src/shared/lib/auth.ts
export function getAuthParams(): string {
  const domain = localStorage.getItem("auth_domain") || "";
  const username = localStorage.getItem("username") || "";
  const session_code = localStorage.getItem("session_token") || "";

  return `?domain=${domain}&username=${username}&session_code=${session_code}`;
}
