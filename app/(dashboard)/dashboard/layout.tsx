"use client";

// Shell del panel administrativo: nav entre Productos y Perfil.
// El guard de sesión real vive en middleware.ts (redirige a /login si no
// hay usuario autenticado antes de que esta ruta siquiera renderice).

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LogoutIcon, PaletteIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

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
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/perfil"
              aria-label="Personalizar colores de la tienda"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line-strong text-ink-soft transition-colors hover:bg-ink/5"
            >
              <PaletteIcon width={16} height={16} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line-strong text-ink-faint transition-colors hover:border-danger hover:text-danger"
            >
              <LogoutIcon width={16} height={16} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-284 flex-1 px-5 py-6 sm:px-8">{children}</main>
    </div>
  );
}
