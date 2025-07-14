// src/features/tasks/task-form/model/task-schemas.ts
import { z } from "zod";
// import dayjs, { type Dayjs } from "dayjs"; // REMOVE or COMMENT OUT this line as dayjs/Dayjs are no longer directly used for schema validation within this file.

// Схема первой страницы формы создания задания
export const createTaskStep1Schema = z
  .object({
    objectId: z.string().min(1, "Пожалуйста, выберите объект для проверки."),
    checkDate: z.date({ required_error: "Пожалуйста, укажите дату проверки." }),
    checkTime: z.date({
      required_error: "Пожалуйста, укажите время начала проверки.",
    }),
    isRepeatInspection: z.boolean(),
    lastCheckDate: z.date().nullable().optional(),
    operatorId: z.string().min(1, "Пожалуйста, выберите оператора."),
    comment: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isRepeatInspection) {
        return data.lastCheckDate !== null && data.lastCheckDate !== undefined;
      }
      return true;
    },
    {
      message: "Пожалуйста, укажите дату последней проверки.",
      path: ["lastCheckDate"],
    }
  );

// Типы для совместимости с react-hook-form
export type CreateTaskStep1Form = z.infer<typeof createTaskStep1Schema>;

// Схема payload для API создания задания
export const addNewTaskPayloadSchema = z.object({
  user_id: z.number(),
  manager_id: z.number(),
  object_id: z.number(),
  shift_id: z.number(),
  checking_type_id: z.number(),
  date_time: z.string(), // Формат "YYYY-MM-DD HH:mm:ss"
  date_previous_check: z.string().optional(), // Формат "YYYY-MM-DD"
  comment: z.string().optional(),
});

export type AddNewTaskPayload = z.infer<typeof addNewTaskPayloadSchema>;
