import { redirect } from "next/navigation";
import { isSuperadmin } from "@/lib/auth/superadmin";
import { TiendasPanel } from "@/components/tiendas-panel";
import { listarTiendas } from "@/services/admin-tiendas";
import type { Tienda } from "@/types";

// Panel de superadministrador para activar/desactivar tiendas y cambiar su
// plan sin tener que entrar al editor de tablas de Supabase. Mismo patrón de
// protección que /admin/licencias: Server Component, redirige antes de
// renderizar nada si no eres superadmin.
export default async function TiendasAdminPage() {
  const autorizado = await isSuperadmin();
  if (!autorizado) redirect("/");

  let tiendas: Tienda[] = [];
  let errorConexion = false;
  try {
    tiendas = await listarTiendas();
  } catch {
    errorConexion = true;
  }

  return (
    <main className="min-h-full flex-1 bg-ground">
      <div className="mx-auto max-w-284 px-5 py-8 sm:px-8">
        {errorConexion ? (
          <div className="rounded-xl border border-dashed border-line-strong p-8 text-center text-sm text-ink-soft">
            No se pudo conectar con Supabase. Verifica <code>SUPABASE_SERVICE_ROLE_KEY</code> y{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> en <code>.env</code>.
          </div>
        ) : (
          <TiendasPanel tiendasIniciales={tiendas} />
        )}
      </div>
    </main>
  );
}
