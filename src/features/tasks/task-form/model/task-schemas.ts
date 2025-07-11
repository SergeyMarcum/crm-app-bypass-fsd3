// src/features/tasks/task-form/model/task-schemas.ts
import { z } from "zod";

export const createTaskStep1Schema = z.object({
  objectId: z.string().min(1, "Пожалуйста, выберите объект для проверки."),
  // Изменено: Явно указываем union для Date | null
  checkDate: z.union([z.date(), z.null()]).refine((val) => val !== null, {
    message: "Пожалуйста, укажите дату проверки.",
  }),
  // Изменено: Явно указываем union для Date | null
  checkTime: z.union([z.date(), z.null()]).refine((val) => val !== null, {
    message: "Пожалуйста, укажите время начала проверки.",
  }),
  isRepeatInspection: z.boolean(),
  lastCheckDate: z.union([z.date(), z.null()]).optional(), // Также убедимся, что nullable и optional
  operatorId: z.string().min(1, "Пожалуйста, выберите оператора."),
  comment: z.string().optional(),
});

export type CreateTaskStep1Form = z.infer<typeof createTaskStep1Schema>;

export const addNewTaskPayloadSchema = z.object({
  user_id: z.number(),
  manager_id: z.number(),
  object_id: z.number(),
  shift_id: z.number(),
  checking_type_id: z.number(),
  date_time: z.string(), // ISOString
});

export type AddNewTaskPayload = z.infer<typeof addNewTaskPayloadSchema>;
