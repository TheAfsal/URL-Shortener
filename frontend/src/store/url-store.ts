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
  deleteUrl: (shortCode: string) => Promise<void>;
}

export const useUrlStore = create<UrlState>((set, get) => ({
  urls: [],
  isLoading: false,

  fetchUrls: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/url/my-urls");
      set({ urls: response.data });
    } finally {
      set({ isLoading: false });
    }
  },

  shortenUrl: async (originalUrl: string) => {
    const response = await api.post("/url/shorten", { longUrl: originalUrl });
    const newUrl = response.data;
    set({ urls: [newUrl, ...get().urls] });
    return newUrl;
  },

  deleteUrl: async (shortCode: string) => {
    await api.delete(`/url/${shortCode}`);
    set({
      urls: get().urls.filter((url) => url.shortCode !== shortCode),
    });
  },
}));
