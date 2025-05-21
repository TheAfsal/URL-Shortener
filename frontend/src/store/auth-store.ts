import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

interface User {
 id: string;
 name: string;
 email: string;
}

interface AuthState {
 user: User | null;
 accessToken: string | null;
 refreshToken: string | null;
 isAuthenticated: boolean;
 login: (email: string, password: string) => Promise<void>;
 register: (name: string, email: string, password: string) => Promise<void>;
 logout: () => void;
 refreshAccessToken: () => Promise<string>;
}

export const useAuthStore = create<AuthState>()(
 persist(
  (set, get) => ({
   user: null,
   accessToken: null,
   refreshToken: null,
   isAuthenticated: false,

   login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });
    const { user, accessToken, refreshToken } = response.data;

    set({
     user,
     accessToken,
     refreshToken,
     isAuthenticated: true,
    });
   },

   register: async (name: string, email: string, password: string) => {
    await api.post("/api/auth/register", { name, email, password });
   },

   logout: () => {
    set({
     user: null,
     accessToken: null,
     refreshToken: null,
     isAuthenticated: false,
    });
   },

   refreshAccessToken: async () => {
    const refreshToken = get().refreshToken;

    if (!refreshToken) {
     throw new Error("No refresh token available");
    }

    try {
     const response = await api.post("/api/auth/refresh", { refreshToken });
     const { accessToken, newRefreshToken } = response.data;

     set({
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
     });

     return accessToken;
    } catch (error) {
     // If refresh fails, log the user out
     get().logout();
     throw error;
    }
   },
  }),
  {
   name: "auth-storage",
   partialize: (state) => ({
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    isAuthenticated: state.isAuthenticated,
   }),
  }
 )
);
