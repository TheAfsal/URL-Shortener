import { create } from "zustand";
import api from "../lib/api";

interface Url {
 id: string;
 originalUrl: string;
 shortCode: string;
 createdAt: string;
 clicks: number;
}

interface UrlState {
 urls: Url[];
 isLoading: boolean;
 fetchUrls: () => Promise<void>;
 shortenUrl: (originalUrl: string) => Promise<void>;
}

export const useUrlStore = create<UrlState>((set, get) => ({
 urls: [],
 isLoading: false,

 fetchUrls: async () => {
  set({ isLoading: true });
  try {
   const response = await api.get("/api/url/my-urls");
   set({ urls: response.data });
  } finally {
   set({ isLoading: false });
  }
 },

 shortenUrl: async (originalUrl: string) => {
  const response = await api.post("/api/url/shorten", { longUrl: originalUrl });
  const newUrl = response.data;
  set({ urls: [newUrl, ...get().urls] });
  return newUrl;
 },
}));
