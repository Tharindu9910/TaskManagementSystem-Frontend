
  
  export interface Task {
    id: string; // Typically a UUID or MongoDB ObjectId string
    title: string;
    description?: string; // Optional per standard task logic [cite: 28]
    completed: boolean;
    userId: string; // To support Authorization: Users only access their own tasks [cite: 50]
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
  }

  export interface CreateTaskInput {
    title: string;
    description: string;
  }
  export interface UpdateTaskInput {
    title?: string;
    description?: string;
    completed?: boolean;
  }

  export interface AuthResponse {
    user: {
      id: string;
      email: string;
    };
  }
  export interface User {
      id: string;
      email: string;
  }
  export interface GetMeResponse {
     sub: string;
     email: string
  } 

  export interface AuthContextType {
    user: User|null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthLoading: boolean;
    authError: string
  }
  