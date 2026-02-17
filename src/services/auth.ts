import api from "@/src/lib/axios";
import { AuthResponse, GetMeResponse } from "../types";

export const authService = {
  register: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getMe: async (): Promise<GetMeResponse> => {
    const res = await api.get("/auth/me");
    return res.data;
  },
}
// export const fetchCurrentUser = async () => {
//   const res = await api.get('/auth/me');
//   return res.data;
// };
