"use client";

// Shell del panel administrativo: nav entre Productos, Pedidos y Perfil.
// El guard de sesión real vive en middleware.ts (redirige a /login si no
// hay usuario autenticado antes de que esta ruta siquiera renderice).
//
// El aviso de vencimiento del plan Pro (PlanRenewalBanner) NO vive acá —
// se pidió que fuera algo chico y cerrable justo debajo de la tarjeta del
// catálogo en /dashboard, no un banner arriba de todo el panel (ver
// components/dashboard-inventory.tsx). Por eso este layout no necesita la
// tienda y puede quedarse como Client Component simple.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { HelpIcon, LogoutIcon, PaletteIcon } from "@/components/icons";
import { SoporteLink } from "@/components/soporte-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { VitrinaMark } from "@/components/vitrina-mark";
import { createClient } from "@/lib/supabase/client";

const THEME_LABELS = { toLight: "Cambiar a tema claro", toDark: "Cambiar a tema oscuro" };

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
        <div className="mx-auto flex max-w-284 flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 sm:contents">
            <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg">
              <VitrinaMark size={26} />
              Vitrina Digital
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:order-3 sm:gap-2">
              <Link
                href="/guia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver la guía de uso"
                title="Guía de uso"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-line-strong text-ink-soft transition-colors hover:bg-ink/5 sm:h-9 sm:w-9"
              >
                <HelpIcon width={16} height={16} />
              </Link>
              <SoporteLink />
              <ThemeToggle labels={THEME_LABELS} />
              <Link
                href="/dashboard/perfil"
                aria-label="Personalizar colores de la tienda"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-line-strong text-ink-soft transition-colors hover:bg-ink/5 sm:h-9 sm:w-9"
              >
                <PaletteIcon width={16} height={16} />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-line-strong text-ink-faint transition-colors hover:border-danger hover:text-danger sm:h-9 sm:w-9"
              >
                <LogoutIcon width={16} height={16} />
              </button>
            </div>
          </div>
          <nav className="flex items-center gap-1 rounded-md bg-surface-2 p-1 text-sm font-semibold sm:order-2">
            <Link
              href="/dashboard"
              className={`flex-1 rounded px-3 py-1.5 text-center transition-colors sm:flex-none ${
                pathname === "/dashboard" ? "bg-surface text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              Productos
            </Link>
            <Link
              href="/dashboard/pedidos"
              className={`flex-1 rounded px-3 py-1.5 text-center transition-colors sm:flex-none ${
                pathname === "/dashboard/pedidos"
                  ? "bg-surface text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Pedidos
            </Link>
            <Link
              href="/dashboard/perfil"
              className={`flex-1 rounded px-3 py-1.5 text-center transition-colors sm:flex-none ${
                pathname === "/dashboard/perfil"
                  ? "bg-surface text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Perfil
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-284 flex-1 px-5 py-6 sm:px-8">{children}</main>
    </div>
  );
}
