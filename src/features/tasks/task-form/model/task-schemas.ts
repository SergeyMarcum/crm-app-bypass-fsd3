// src/features/tasks/task-form/model/task-schemas.ts
import { z } from "zod";
// import dayjs, { type Dayjs } from "dayjs"; // REMOVE or COMMENT OUT this line as dayjs/Dayjs are no longer directly used for schema validation within this file.

// Схема первой страницы формы создания задания
export const createTaskStep1Schema = z
  .object({
    objectId: z.string().min(1, "Пожалуйста, выберите объект для проверки."),
    checkDate: z.date().nullable(),
    checkTime: z.date().nullable(),
    isRepeatInspection: z.boolean(),
    lastCheckDate: z.date().nullable().optional(),
    operatorId: z.string().min(1, "Пожалуйста, выберите оператора."),
    comment: z.string().optional(),
  })
  .refine((data) => data.checkDate !== null, {
    message: "Пожалуйста, укажите дату проверки.",
    path: ["checkDate"],
  })
  .refine((data) => data.checkTime !== null, {
    message: "Пожалуйста, укажите время начала проверки.",
    path: ["checkTime"],
  });

// Типы для совместимости с react-hook-form
export type CreateTaskStep1Form = {
  objectId: string;
  checkDate: Date | null; // Keep as Date | null
  checkTime: Date | null; // Keep as Date | null
  isRepeatInspection: boolean;
  lastCheckDate?: Date | null; // Keep as Date | null
  operatorId: string;
  comment?: string;
};

// Схема payload для API создания задания
export const addNewTaskPayloadSchema = z.object({
  user_id: z.number(),
  manager_id: z.number(),
  object_id: z.number(),
  shift_id: z.number(),
  checking_type_id: z.number(),
  date_time: z.string(), // ISOString
  date_time_previous_check: z.string().nullable().optional(),
  comment: z.string().optional(),
});

export type AddNewTaskPayload = z.infer<typeof addNewTaskPayloadSchema>;
