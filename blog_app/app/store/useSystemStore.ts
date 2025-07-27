import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { changeLanguage } from "i18next";

export interface Language {
  lang: string;
}

interface StoreState {
  lang: string;
  setLanguage: (language: Language["lang"]) => void;
}

const useStore = (set: any, get: any): StoreState => ({
  lang: "en", // default language, adjust as needed
  setLanguage: (lang: Language["lang"]) => {
    set({ lang });
    changeLanguage(lang);
  },
});

const useSystemStore = create<StoreState>()(
  persist(useStore, {
    name: "system-storage",
    storage: createJSONStorage(() => localStorage),
  })
);

export default useSystemStore;
