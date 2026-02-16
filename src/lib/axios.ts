import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Required for Auth Cookies
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired, try refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh"); // cookie automatically sent
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        // refresh failed → user must login again
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default api;
