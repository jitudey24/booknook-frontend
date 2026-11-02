"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useSyncExternalStore,
} from "react";

import {
  applyTheme,
  applyThemeAnimated,
  DEFAULT_THEME,
  getStoredTheme,
  storeTheme,
  type Theme,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/*
 * Module-level external store, shared by every ThemeProvider instance.
 *
 * Deliberately seeded to the light default — the exact markup the server
 * rendered — and only updated from localStorage in a post-hydration layout
 * effect. That way every hydration pass (root or a deferred Suspense
 * subtree) sees a snapshot identical to SSR, no matter whether React reads
 * getServerSnapshot or getSnapshot, so a saved dark theme can never cause a
 * hydration mismatch. The visual theme itself is already correct before
 * hydration because the inline no-flash script set the class while parsing.
 */
let activeTheme: Theme = DEFAULT_THEME;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return activeTheme;
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Seed the store from localStorage and re-apply the class to <html>. The
  // re-apply is a no-op in production; in development React's Strict Mode
  // remount resets <html> to its JSX attributes, which would otherwise clear
  // the class the inline no-flash script set. Runs before paint, so the
  // aria-label swap is never visible.
  useLayoutEffect(() => {
    const stored = getStoredTheme();
    applyTheme(stored);

    if (stored !== activeTheme) {
      activeTheme = stored;
      listeners.forEach((listener) => listener());
    }
  }, []);

  const setTheme = (next: Theme) => {
    activeTheme = next;
    applyThemeAnimated(next);
    storeTheme(next);

    listeners.forEach((listener) => listener());
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const value: ThemeContextValue = { theme, setTheme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
