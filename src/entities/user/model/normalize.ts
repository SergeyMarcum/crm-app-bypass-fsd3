// src/entities/user/model/normalize.ts
import { User, NormalizedUser } from "../types";

export const roleMap: { [key: number]: string } = {
  1: "Администратор ИТЦ",
  2: "Администратор Филиала",
  3: "Мастер",
  4: "Оператор",
  5: "Наблюдатель Филиала",
  6: "Гость",
  7: "Уволенные",
  8: "Администратор Общества",
};

export const statusMap: { [key: number]: string } = {
  1: "Работает",
  2: "Уволен(а)",
  3: "Отпуск",
  4: "Командировка",
  5: "Больничный",
};

export const normalizeUser = (user: User): NormalizedUser => ({
  id: user.id ?? 0,
  fullName: user.full_name || "",
  department: user.department || "",
  email: user.email || "",
  phone: user.phone || "",
  accessRights: roleMap[user.role_id] || "Неизвестно",
  status: user.status_id ? statusMap[user.status_id] : "Неизвестно",
  company: user.company || "",
  position: user.position || "",
  name: user.name ?? "", // Преобразуем undefined в ""
  photo: user.photo ?? null,
});

export const normalizeUsers = (users: User[]): NormalizedUser[] =>
  users.map(normalizeUser);

export const mapRoleIdToLabel = (roleId: number): string =>
  roleMap[roleId] || "Неизвестно";

export const mapStatusIdToLabel = (statusId: number): string =>
  statusMap[statusId] || "Неизвестно";
