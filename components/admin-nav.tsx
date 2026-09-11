"use client";

// Nav compartido por /admin/tiendas y /admin/licencias — antes eran dos
// vistas sueltas sin forma de moverse entre ellas salvo escribiendo la URL a
// mano. Mismo patrón visual que el nav de /dashboard (dashboard/layout.tsx).

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CardIcon, LogoutIcon, StoreIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-284 flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg">VentaFácil</span>
          <span className="rounded bg-surface-2 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-faint">
            Admin
          </span>
        </div>

        <nav className="flex items-center gap-1 rounded-md bg-surface-2 p-1 text-sm font-semibold">
          <Link
            href="/admin/tiendas"
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 transition-colors ${
              pathname === "/admin/tiendas"
                ? "bg-surface text-ink"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <StoreIcon width={14} height={14} />
            Tiendas
          </Link>
          <Link
            href="/admin/licencias"
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 transition-colors ${
              pathname === "/admin/licencias"
                ? "bg-surface text-ink"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <CardIcon width={14} height={14} />
            Licencias
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-ink-soft underline underline-offset-2 hover:text-ink"
          >
            Mi tienda
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
  );
}
