// src/shared/api/auth/client.ts
import axios from "../axios";

export const authApi = {
  login: async (credentials: { login: string; password: string }) => {
    const response = await axios.post("/login", credentials);
    return response.data;
  },
};
