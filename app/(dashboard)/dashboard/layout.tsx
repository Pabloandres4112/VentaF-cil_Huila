"use client";

// Shell del panel administrativo: nav entre Productos y Perfil.
// Sin guard de sesión todavía (Fase 1/2 de Supabase en pausa a propósito).

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const THEME_LABELS = { toLight: "Cambiar a tema claro", toDark: "Cambiar a tema oscuro" };

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-ground">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-284 items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="font-display text-lg">
            VentaFácil
          </Link>
          <nav className="flex items-center gap-1 rounded-md bg-surface-2 p-1 text-sm font-semibold">
            <Link
              href="/dashboard"
              className={`rounded px-3 py-1.5 transition-colors ${
                pathname === "/dashboard" ? "bg-surface text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              Productos
            </Link>
            <Link
              href="/dashboard/perfil"
              className={`rounded px-3 py-1.5 transition-colors ${
                pathname === "/dashboard/perfil"
                  ? "bg-surface text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Perfil
            </Link>
          </nav>
          <ThemeToggle labels={THEME_LABELS} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-284 flex-1 px-5 py-6 sm:px-8">{children}</main>
    </div>
  );
}
