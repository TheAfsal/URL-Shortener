/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

interface User {
  email: string;
}

interface Url {
  shortCode: string;
  longUrl: string;
  userEmail: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  urls: Url[];
  message: string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyMagicLink: (token: string) => Promise<void>;
  logout: () => void;
  shortenUrl: (longUrl: string) => Promise<void>;
  fetchUrls: () => Promise<void>;
  setMessage: (message: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      urls: [],
      message: "",

      login: async (email: string, password: string) => {
        try {
          const response = await api.post("/auth/login", { email, password });
          const { accessToken } = response.data;
          set({
            user: { email },
            accessToken,
            isAuthenticated: true,
            message: "Login successful!",
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ message: `Login failed: ${errorMessage}` });
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        try {
          await api.post("/auth/register", { email, password });
          set({
            message: "Registration successful! Check your email for a magic link to log in.",
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ message: `Registration failed: ${errorMessage}` });
          throw error;
        }
      },

      verifyMagicLink: async (token: string) => {
        try {
          const response = await api.get(`/auth/magic/${token}`);
          const { accessToken } = response.data;
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          set({
            user: { email: payload.email },
            accessToken,
            isAuthenticated: true,
            message: "Magic link verified! You are now logged in.",
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ message: `Magic link verification failed: ${errorMessage}` });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          urls: [],
          message: "Logged out.",
        });
      },

      shortenUrl: async (longUrl: string) => {
        try {
          const accessToken = get().accessToken;
          const response = await api.post(
            "/url/shorten",
            { longUrl },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          const url = response.data;
          set((state) => ({
            urls: [...state.urls, url],
            message: "URL shortened!",
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ message: `Shortening failed: ${errorMessage}` });
          throw error;
        }
      },

      fetchUrls: async () => {
        try {
          const accessToken = get().accessToken;
          const response = await api.get("/url/my-urls", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          set({ urls: response.data });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ message: `Failed to fetch URLs: ${errorMessage}` });
          throw error;
        }
      },

      setMessage: (message: string) => {
        set({ message });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);