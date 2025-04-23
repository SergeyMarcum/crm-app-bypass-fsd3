// src/shared/api/auth/client.ts
import axios from "axios";
import { z } from "zod";

const domainListSchema = z.record(z.string(), z.string());
const loginResponseSchema = z.object({
  status: z.literal("OK"),
  token: z.string(),
  user: z.object({
    login: z.string(),
    system_login: z.string().optional(),
    full_name: z.string().optional(),
    position: z.string().optional(),
    email: z.string().optional(),
    department: z.string().optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    photo: z.string().nullable().optional(),
    role_id: z.number(),
  }),
});

export const authApi = {
  getDomainList: async () => {
    try {
      const response = await axios.get("/api/domain-list");
      console.log("Raw getDomainList response:", response.data);
      const data = domainListSchema.safeParse(response.data);
      if (!data.success) {
        console.error("Zod validation error:", data.error);
        throw new Error("Invalid domain list format");
      }
      console.log("Parsed getDomainList data:", data.data);
      return data.data;
    } catch (error: unknown) {
      console.error("getDomainList error:", error);
      throw new Error("Failed to fetch domain list");
    }
  },

  login: async (credentials: {
    username: string;
    password: string;
    domain: string;
  }) => {
    try {
      const response = await axios.post("/api/login", credentials);
      console.log("login response:", response.data);
      const data = loginResponseSchema.safeParse(response.data);
      if (!data.success) {
        console.error("Zod validation error:", data.error);
        throw new Error("Invalid login response format");
      }
      return {
        sessionCode: data.data.token,
        role_id: data.data.user.role_id,
      };
    } catch (error: unknown) {
      console.error("login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Invalid credentials");
      }
      throw new Error("Failed to login");
    }
  },

  logout: async () => {
    try {
      await axios.get("/api/logout");
      console.log("logout successful");
    } catch (error: unknown) {
      console.error("logout error:", error);
      throw new Error("Failed to logout");
    }
  },

  checkSession: async (params: {
    username: string;
    domain: string;
    sessionCode: string;
  }) => {
    try {
      const response = await axios.get("/api/check-session", {
        params,
      });
      console.log("checkSession response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("checkSession error:", error);
      throw new Error("Invalid session");
    }
  },
};
