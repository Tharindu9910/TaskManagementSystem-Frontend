"use client";

import React, { useEffect, useState } from "react";
import { Plus, CheckCircle2, Circle, Clock, Trash2, Edit3 } from "lucide-react";
import api from "@/src/lib/axios";
import { Task } from "@/src/types";
import { useAuth } from "@/src/context/AuthContext";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { logout } = useAuth();

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        // Hits your NestJS GET /tasks endpoint
        const response = await api.get("/tasks");
        console.log("response:", response);
        setTasks(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTitle.trim()) return;

    try {
      setIsCreating(true);

      const res = await api.post("/tasks", {
        title: newTitle,
        description: newDescription,
      });

      // Optimistic UI update
      setTasks((prev) => [res.data, ...prev]);

      // Reset form
      setNewTitle("");
      setNewDescription("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    // optimistic update
    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !completed } : t))
    );

    try {
      await api.put(`/tasks/${taskId}`, {
        completed: !completed,
      });
    } catch (err) {
      setTasks(previousTasks);
      alert("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      // Hits your NestJS DELETE /tasks/:id endpoint [cite: 49]
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">Manage your daily workflow</p>
        </div>
        <div className="flex gap-4">
          {/* <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
            }}
          >
            <Plus size={20} />
            New Task
          </button> */}
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              className="border text-black rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleCreateTask}
              disabled={isCreating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>

          <button
            onClick={logout}
            className="text-gray-500 hover:text-red-600 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Loading State  */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State  */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Task Grid/List  */}
      {!isLoading && tasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">
            No tasks found. Create your first task to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    task.completed === true
                      ? "bg-green-400 text-green-700"
                      : "bg-gray-400 text-gray-700"
                  }`}
                ></span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleToggleComplete(task.id, task.completed)
                    }
                    className="text-gray-400 hover:text-green-600"
                  >
                    {task.completed ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  <button className="text-gray-400 hover:text-blue-600">
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{task.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {task.description}
              </p>
              <div className="flex items-center text-xs text-gray-400 gap-1">
                <Clock size={14} />
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
