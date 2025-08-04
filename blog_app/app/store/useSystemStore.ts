import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { changeLanguage } from "i18next";

export interface Language {
  lang: string;
}

export interface Theme {
  mode: "light" | "dark";
}

interface StoreState {
  lang: string;
  setLanguage: (language: Language["lang"]) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const useStore = (set: any, get: any): StoreState => ({
  lang: "en", // default language, adjust as needed
  setLanguage: (lang: Language["lang"]) => {
    set({ lang });
    changeLanguage(lang);
  },
  theme: { mode: "light" }, // default theme, adjust as needed
  setTheme: (theme: Theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      if (theme.mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme =
      currentTheme.mode === "light"
        ? { mode: "dark" as const }
        : { mode: "light" as const };
    set({ theme: newTheme });
    if (typeof window !== "undefined") {
      if (newTheme.mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },
});

const useSystemStore = create<StoreState>()(
  persist(useStore, {
    name: "system-storage",
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

export default useSystemStore;
