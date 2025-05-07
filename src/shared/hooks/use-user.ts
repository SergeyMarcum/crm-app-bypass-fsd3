// src/shared/hooks/use-user.ts
import { useQuery } from "@tanstack/react-query";
import { normalizeUser } from "@entities/user";
import { NormalizedUser } from "@entities/user/types";
import { userApi } from "@shared/api/user";

export const useUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await userApi.getCurrentUser();
      return normalizeUser(response);
    },
  });

  return {
    user: data as NormalizedUser | undefined,
    isLoading,
    error,
  };
};
