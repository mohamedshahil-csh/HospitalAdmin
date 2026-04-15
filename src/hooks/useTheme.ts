import { create } from "zustand";

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setDark: (value: boolean) => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  isDark: false,
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("teleems-theme", next ? "dark" : "light");
      }
      return { isDark: next };
    }),
  setDark: (value: boolean) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", value);
      localStorage.setItem("teleems-theme", value ? "dark" : "light");
    }
    set({ isDark: value });
  },
}));

// Call on mount to initialise from localStorage
export function initTheme() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("teleems-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = stored ? stored === "dark" : prefersDark;
  useTheme.getState().setDark(isDark);
}
