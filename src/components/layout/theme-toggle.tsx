"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = mounted ? theme === "dark" : false;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-panel/80 text-foreground/80 transition hover:bg-panel hover:text-foreground"
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </button>
  );
}
