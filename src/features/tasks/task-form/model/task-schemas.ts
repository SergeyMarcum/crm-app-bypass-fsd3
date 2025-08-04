// src/features/tasks/task-form/model/task-schemas.ts
import { z } from "zod";

// Схема первой страницы формы создания задания
export const createTaskStep1Schema = z
  .object({
    objectId: z.string().min(1, "Пожалуйста, выберите объект для проверки"),
    checkDate: z
      .date({ required_error: "Пожалуйста, укажите дату проверки" })
      .nullable(),
    checkTime: z
      .date({
        required_error: "Пожалуйста, укажите время начала проверки",
      })
      .nullable(),
    isRepeatInspection: z.boolean().default(false).optional(),
    lastCheckDate: z.date().nullable().optional(),
    periodic: z
      .number()
      .min(0, "Недопустимое значение периодичности")
      .max(2, "Недопустимое значение периодичности")
      .default(0), // Строго number с значением по умолчанию 0
    operatorId: z.string().min(1, "Пожалуйста, выберите оператора"),
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
      message:
        "Пожалуйста, укажите дату последней проверки для повторной проверки",
      path: ["lastCheckDate"],
    }
  );

export type CreateTaskStep1Form = z.infer<typeof createTaskStep1Schema>;

// Схема payload для API создания задания
export const addNewTaskPayloadSchema = z
  .object({
    user_id: z
      .number()
      .int()
      .positive("ID пользователя должен быть положительным числом"),
    manager_id: z
      .number()
      .int()
      .positive("ID менеджера должен быть положительным числом"),
    object_id: z
      .number()
      .int()
      .positive("ID объекта должен быть положительным числом"),
    shift_id: z.number().min(0).max(1, "ID смены должен быть 0 или 1"),
    checking_type_id: z
      .number()
      .min(0)
      .max(1, "ID типа проверки должен быть 0 или 1"),
    date_time: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
        "Дата и время должны быть в формате YYYY-MM-DD HH:mm:ss"
      ),
    date_previous_check: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Дата должна быть в формате YYYY-MM-DD")
      .optional(),
    comment: z.string().optional(),
    periodic: z
      .number()
      .min(0, "Недопустимое значение периодичности")
      .max(2, "Недопустимое значение периодичности"),
  })
  .refine(
    (data) => {
      if (data.checking_type_id === 1) {
        return (
          data.date_previous_check !== undefined &&
          data.date_previous_check !== null
        );
      }
      return true;
    },
    {
      message: "Дата предыдущей проверки обязательна для повторной проверки",
      path: ["date_previous_check"],
    }
  );

export type AddNewTaskPayload = z.infer<typeof addNewTaskPayloadSchema>;
