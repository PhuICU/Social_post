"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  _id: string;
  full_name: string;
  address?: string;
  email: string;
  phone?: string;
  avatar: {
    url: string;
    public_id: string;
  };
  bio: string;
  verify: string;
  slug: string;
}

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useStore = (set: any, get: any): StoreState => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
});

const useUserStore = create<StoreState>()(
  persist(useStore, {
    name: "user-storage",
    storage: createJSONStorage(() => {
      if (typeof window !== "undefined") {
        return localStorage;
      }
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    }),
  })
);
export default useUserStore;
