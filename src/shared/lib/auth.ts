// src/shared/lib/auth.ts
export function getAuthParams(): Record<string, string> {
  let domain = localStorage.getItem("auth_domain") || "";

  if (!domain) {
    const authUserStr = localStorage.getItem("auth_user");
    if (authUserStr) {
      try {
        const authUser = JSON.parse(authUserStr);
        domain = authUser.domain || "";
      } catch (e) {
        console.error("Error parsing auth_user in getAuthParams:", e);
      }
    }
  }

  // Дефолтный фоллбек на orenburg, если домен все еще пустой
  if (!domain) {
    domain = "orenburg";
  }

  return {
    domain,
    username: localStorage.getItem("username") || "",
    session_code: localStorage.getItem("session_token") || "",
  };
}
