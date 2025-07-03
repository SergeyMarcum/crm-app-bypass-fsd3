// src/pages/tasks/create/model/types.ts
export type TaskStep1Data = {
  objectId: number | null;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  isRepeat: boolean;
  previousDate: string | null;
  operatorId: number | null;
  comment: string;
};

export type TaskStep = 0 | 1 | 2;
