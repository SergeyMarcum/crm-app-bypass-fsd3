// src/pages/tasks/create/model/store.ts

import { create } from "zustand";
import type { TaskStep, TaskStep1Data } from "./types";

interface TaskCreateState {
  step: TaskStep;
  step1: TaskStep1Data;
  setStep: (s: TaskStep) => void;
  updateStep1: (data: Partial<TaskStep1Data>) => void;
  reset: () => void;
}

const initialStep1: TaskStep1Data = {
  objectId: null,
  date: "",
  time: "",
  isRepeat: false,
  previousDate: null,
  operatorId: null,
  comment: "",
};

export const useTaskCreateStore = create<TaskCreateState>((set) => ({
  step: 0,
  step1: initialStep1,
  setStep: (s) => set({ step: s }),
  updateStep1: (data) =>
    set((state) => ({ step1: { ...state.step1, ...data } })),
  reset: () => set({ step: 0, step1: initialStep1 }),
}));
