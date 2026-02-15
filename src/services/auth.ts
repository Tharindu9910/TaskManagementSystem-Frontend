import api from "@/src/lib/axios";

export const registerUser = async (data: { email: string; password: string }) => {
  return await api.post("/auth/register", data);
};

export const loginUser = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};

export const logoutUser = async () => {
  await api.post("/auth/logout", {});
};

// export const fetchCurrentUser = async () => {
//   const res = await api.get('/auth/me');
//   return res.data;
// };
