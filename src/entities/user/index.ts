// src/entities/user/index.ts
export type { User, NormalizedUser, EditUserPayload } from "./types";
export {
  normalizeUser,
  normalizeUsers,
  roleMap,
  statusMap,
} from "./model/normalize";
