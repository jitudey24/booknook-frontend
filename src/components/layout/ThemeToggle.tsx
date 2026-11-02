"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/layout/ThemeProvider";

/**
 * Minimal icon-only theme switch for the navbar.
 *
 * Both icons and both tooltip texts always exist in the DOM; which one shows
 * is controlled exclusively by the `dark:` CSS variant. Nothing in the
 * rendered output depends on React state, so server and client markup are
 * always identical — a hydration mismatch is impossible. Clicking delegates
 * to the centralized ThemeProvider.
 */
export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:outline-none"
    >
      {/* Sun — visible in light mode */}
      <Sun className="absolute size-5 text-amber-500 opacity-100 transition-opacity duration-300 dark:opacity-0" />

      {/* Moon — visible in dark mode */}
      <Moon className="absolute size-5 text-[#cbd5e1] opacity-0 transition-opacity duration-300 dark:opacity-100" />

      {/* Tooltip */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-[#f8fafc] opacity-0 shadow-lg transition-opacity duration-200 group-focus-visible:opacity-100 group-hover:opacity-100 dark:bg-[#2a3550]"
      >
        <span className="inline dark:hidden">Switch to Dark Mode</span>
        <span className="hidden dark:inline">Switch to Light Mode</span>
      </span>
    </button>
  );
}
