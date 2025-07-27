import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  _id: string;
  full_name: string;
  address?: string;
  email: string;
  phone?: string;
  avatar: { url: string };
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
    storage: createJSONStorage(() => localStorage),
  })
);
export default useUserStore;
