/**
 * Task Management System - Type Definitions
 * Evaluates: TypeScript usage and separation of concerns [cite: 35, 61]
 */

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
  }
  
  export interface Task {
    id: string; // Typically a UUID or MongoDB ObjectId string
    title: string;
    description?: string; // Optional per standard task logic [cite: 28]
    completed: boolean;
    userId: string; // To support Authorization: Users only access their own tasks [cite: 50]
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
  }
  
  /**
   * Data Transfer Object (DTO) for creating a task
   * Ensures specific fields for POST /tasks [cite: 47]
   */
  export interface CreateTaskDto {
    title: string;
    description?: string;
  }
  
  /**
   * DTO for updating a task
   * Ensures specific fields for PUT /tasks/:id [cite: 48]
   */
  export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
  }