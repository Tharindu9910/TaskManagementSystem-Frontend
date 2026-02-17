"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock, Trash2, Edit3 } from "lucide-react";
import { Task } from "@/src/types";
import { useAuth } from "@/src/context/AuthContext";
import { taskService } from "@/src/services/tasks";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await taskService.getAll();
        setTasks(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    const title = newTitle.trim();
    const description = newDescription.trim();

    if (!title || isCreating) return;

    try {
      setIsCreating(true);
      console.log(newTitle, newDescription);
      const newTask = await taskService.create({
        title,
        description,
      });

      setTasks((prevTasks) => [newTask, ...prevTasks]);

      setNewTitle("");
      setNewDescription("");
    } catch (err: any) {
      alert("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    const previousTasks = tasks;
    const newCompleted = !completed;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t))
    );
    const data = {
      completed: completed,
    };
    try {
      await taskService.update(taskId, { completed: newCompleted });
    } catch (err) {
      setTasks(previousTasks);
      alert("Failed to update task");
    }
  };

  const handleUpdateTask = async (taskId: string) => {
    const title = editTitle.trim();
    const description = editDescription.trim();

    if (!title || isUpdating) return;

    const previousTasks = tasks;

    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, title, description } : t))
    );

    try {
      setIsUpdating(true);

      await taskService.update(taskId, {
        title,
        description,
      });

      // exit edit mode
      setEditingTaskId(null);
    } catch (err) {
      setTasks(previousTasks);
      alert("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await taskService.delete(id);
    } catch (err) {
      setTasks(previousTasks);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Task</h1>
          <p className="text-gray-600">Manage your daily workflow</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={logout}
            className="text-gray-500 py-3 px-4 rounded-md hover:text-red-600 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTask();
          }}
          className="w-full max-w-2xl mx-auto p-4"
        >
          <div className="flex flex-col gap-4">
            {/* Title Input */}
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />

            {/* Description Textarea */}
            <input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add a description..."
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreating || !newTitle.trim()}
              className="w-full sm:w-max text-sm px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors self-end"
            >
              {isCreating ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
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
                    task.completed === false
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

                  <button
                    onClick={() => startEditTask(task)}
                    className="text-gray-400 hover:text-blue-600"
                  >
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
              {editingTaskId === task.id ? (
                <div className="flex flex-col gap-2 mb-3 ">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border border-gray-300 text-gray-400 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none "
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    className="border border-gray-300 text-gray-400 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none "
                  />

                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleUpdateTask(task.id)}
                      disabled={isUpdating}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="text-xs text-white bg-gray-400 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {task.description}
                  </p>
                </>
              )}

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
