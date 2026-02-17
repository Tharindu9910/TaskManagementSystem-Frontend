import api from "@/src/lib/axios";
import { CreateTaskInput, Task, UpdateTaskInput } from "../types";

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const res = await api.get<Task[]>("/tasks");
    return res.data;
  },

  create: async (data: CreateTaskInput): Promise<Task> => {
    const res = await api.post<Task>("/tasks", data);
    return res.data;
  },

  update: async (taskId: string, data: UpdateTaskInput): Promise<Task> => {
    const res = await api.put<Task>(`/tasks/${taskId}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};