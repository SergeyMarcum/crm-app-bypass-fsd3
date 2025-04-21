// src/shared/api/user/client.ts
import { axios } from "../axios";
import { userSchema } from "@shared/lib/schemas";

export const userApi = {
  getUsers: async () => {
    const response = await axios.get("/all-users");
    return userSchema.array().parse(response.data);
  },
};
