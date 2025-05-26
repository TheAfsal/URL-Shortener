import axios from "axios";
import { useAuthStore } from "../store/auth-store";

const api = axios.create({
 baseURL: import.meta.env.VITE_API_URL || "",
 headers: {
  "Content-Type": "application/json",
 },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
 (config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
   config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
 },
 (error) => Promise.reject(error)
);

api.interceptors.response.use(
 (response) => response,
 async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
   originalRequest._retry = true;

   try {
    // const newAccessToken = await useAuthStore.getState().accessToken();

    // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return api(originalRequest);
   } catch (refreshError) {
    useAuthStore.getState().logout();
    return Promise.reject(refreshError);
   }
  }

  return Promise.reject(error);
 }
);

export default api;
