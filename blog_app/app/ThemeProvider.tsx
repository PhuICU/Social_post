"use client";
import { useEffect } from "react";
import useSystemStore from "./store/useSystemStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useSystemStore();

  useEffect(() => {
    // Initialize theme on client side
    if (typeof window !== "undefined") {
      // Check if user has a saved preference
      const savedTheme = localStorage.getItem("system-storage");
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          if (parsed.state?.theme?.mode) {
            setTheme(parsed.state.theme);
          }
        } catch (error) {
          console.error("Error parsing saved theme:", error);
        }
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setTheme({ mode: prefersDark ? "dark" : "light" });
      }
    }
  }, [setTheme]);

  return <>{children}</>;
}
