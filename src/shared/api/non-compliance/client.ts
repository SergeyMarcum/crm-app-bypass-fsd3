// src/shared/non-compliance/client.ts
import { api } from "@/shared/api/axios";
import { storage } from "@/shared/lib/storage";

export const nonComplianceApi = {
  getAllNonCompliances: async () => {
    const domain = storage.get("auth_domain") || "orenburg";
    const username = storage.get("username") || "frontend";
    const sessionCode = storage.get("session_token");

    if (!sessionCode) {
      throw new Error("Session token is missing");
    }

    const response = await api.get("/cases-of-non-compliance", {
      params: {
        domain,
        username,
        session_code: sessionCode,
      },
    });

    console.log("Raw response from /cases-of-non-compliance:", response.data);
    if (!Array.isArray(response.data)) {
      console.error(
        "Expected array from /cases-of-non-compliance, got:",
        response.data
      );
      throw new Error("Invalid response format: Expected array");
    }
    return response.data;
  },

  addNewNonCompliance: async (name: string) => {
    const domain = storage.get("auth_domain") || "orenburg";
    const username = storage.get("username") || "frontend";
    const sessionCode = storage.get("session_token");

    if (!sessionCode) {
      throw new Error("Session token is missing");
    }

    const response = await api.post(
      "/add-new-non-compliance",
      { name },
      {
        params: {
          domain,
          username,
          session_code: sessionCode,
        },
      }
    );
    console.log("Response from /add-new-non-compliance:", response.data);
    return response.data;
  },

  editNonCompliance: async (id: number, name: string) => {
    const domain = storage.get("auth_domain") || "orenburg";
    const username = storage.get("username") || "frontend";
    const sessionCode = storage.get("session_token");

    if (!sessionCode) {
      throw new Error("Session token is missing");
    }

    const response = await api.put(
      "/edit-non-compliance",
      { id, name },
      {
        params: {
          domain,
          username,
          session_code: sessionCode,
        },
      }
    );
    console.log("Response from /edit-non-compliance:", response.data);
    return response.data;
  },

  deleteNonCompliance: async (id: number) => {
    const domain = storage.get("auth_domain") || "orenburg";
    const username = storage.get("username") || "frontend";
    const sessionCode = storage.get("session_token");

    if (!sessionCode) {
      throw new Error("Session token is missing");
    }

    const response = await api.delete("/delete-non-compliance", {
      params: {
        domain,
        username,
        session_code: sessionCode,
      },
      data: { id }, // Перемещаем id в тело запроса
    });
    console.log("Response from /delete-non-compliance:", response.data);
    return response.data;
  },
};
