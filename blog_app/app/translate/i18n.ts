"use client";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import useSystemStore from "../store/useSystemStore";
import en from "./locales/en/translate.json";
import vi from "./locales/vi/translate.json";

const { lang } = useSystemStore.getState();

i18next.use(initReactI18next).init({
  lng: lang,
  resources: {
    en: {
      translation: en,
    },
    vi: {
      translation: vi,
    },
  },
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  react: {
    useSuspense: false, // Disable suspense for React
  },
});

export default i18next;
