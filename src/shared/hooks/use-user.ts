// src/shared/hooks/use-user.ts
export function useUser() {
  return {
    user: { name: "John Doe", email: "john@example.com", avatar: "" },
    logout: () => {},
  };
}
