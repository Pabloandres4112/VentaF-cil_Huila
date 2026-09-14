"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

const STORAGE_KEY = "ventafacil-theme";
type Theme = "light" | "dark";

function currentTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Se resuelve tras montar (no en el render inicial) a propósito: el
    // servidor no conoce localStorage/prefers-color-scheme, así que el
    // placeholder evita un mismatch de hidratación entre server y cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(currentTheme());
  }, []);

  if (!theme) {
    return <span className="h-9 w-9" aria-hidden="true" />;
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? labels.toLight : labels.toDark}
      className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-line-strong text-ink-soft transition-colors hover:bg-ink/5"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
