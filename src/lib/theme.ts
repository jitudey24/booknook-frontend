export type Theme = "light" | "dark";

/** localStorage key shared by the no-flash inline script and the theme provider. */
export const THEME_STORAGE_KEY = "booknook-theme";

/** First-time visitors always start in light mode. */
export const DEFAULT_THEME: Theme = "light";

/** Reads the persisted theme (source of truth for the inline script and provider). */
export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  } catch {
    return DEFAULT_THEME;
  }
}

/** Applies the theme to the document (class drives CSS, colorScheme drives native controls). */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

/** Persists the theme; a silent no-op when storage is unavailable (private mode, quota). */
export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The theme still applies for the current session.
  }
}

const TRANSITION_CLASS = "bn-theme-transition";
let transitionTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Applies a user-initiated theme switch with a short global color crossfade.
 * The helper class enables the transition rules in globals.css for ~320ms so
 * backgrounds, text, borders and icons fade instead of snapping, without
 * slowing down any everyday hover transitions. The initial page load never
 * uses this path, so there is nothing to animate before first paint.
 */
export function applyThemeAnimated(theme: Theme): void {
  const root = document.documentElement;
  root.classList.add(TRANSITION_CLASS);
  applyTheme(theme);

  if (transitionTimer) clearTimeout(transitionTimer);
  transitionTimer = setTimeout(() => {
    document.documentElement.classList.remove(TRANSITION_CLASS);
  }, 320);
}
