// src/features/user-list/hooks/use-user-list.ts
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@shared/api/user";
import { normalizeUsers } from "@entities/user";
import { NormalizedUser } from "@entities/user/types";

export const useUserList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["companyUsers"],
    queryFn: async () => {
      const response = await userApi.getCompanyUsers();
      return {
        users: normalizeUsers(response.users),
        departments: response.departments,
      };
    },
  });

  return {
    users: (data?.users || []) as NormalizedUser[],
    departments: data?.departments || [],
    isLoading,
    error,
  };
};
