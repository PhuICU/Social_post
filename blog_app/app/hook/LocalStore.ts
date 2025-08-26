"use client";
import { useEffect, useState } from "react";

export function useSyncLocalStorage(key: any) {
  const [value, setValue] = useState(() => localStorage.getItem(key));

  useEffect(() => {
    const updateValue = () => {
      setValue(localStorage.getItem(key));
    };

    window.addEventListener("local-storage", updateValue);
    return () => window.removeEventListener("local-storage", updateValue);
  }, [key]);

  return value;
}

export const setLocalStorage = (key: any, value: any) => {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event("local-storage"));
};
