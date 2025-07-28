// src/entities/user/api/requests/get-profile.request.ts
import { api } from "@/shared/api";
import { USER_API } from "../routes";
import { User } from "../../model";

export async function getProfile() {
  // Должна быть обработка ошибки!!!
  const { data } = await api.get<User>(USER_API.profile);
  return data;
}
