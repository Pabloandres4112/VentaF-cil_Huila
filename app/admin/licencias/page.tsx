import { redirect } from "next/navigation";
import { isSuperadmin } from "@/lib/auth/superadmin";
import { LicenciasPanel } from "@/components/licencias-panel";
import { listarLicencias } from "@/services/licencias";
import type { Licencia } from "@/types";

// Sistema de Licencias (multi-producto) — ver PLAN_EJECUCION.md, anexo
// "Sistema de Licencias". Ruta cargada bajo demanda dentro del mismo router
// de la app (no es un proyecto aparte). Verificación server-side: si no es
// superadmin, ni siquiera se envía el HTML del panel al navegador.
export default async function LicenciasPage() {
  const autorizado = await isSuperadmin();
  if (!autorizado) redirect("/");

  let licencias: Licencia[] = [];
  let errorConexion = false;
  try {
    licencias = await listarLicencias();
  } catch {
    errorConexion = true;
  }

  return (
    <main className="min-h-full flex-1 bg-ground">
      <div className="mx-auto max-w-284 px-5 py-8 sm:px-8">
        {errorConexion ? (
          <div className="rounded-xl border border-dashed border-line-strong p-8 text-center text-sm text-ink-soft">
            No se pudo conectar con Supabase. Verifica <code>SUPABASE_SERVICE_ROLE_KEY</code> y{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> en <code>.env.local</code>.
          </div>
        ) : (
          <LicenciasPanel licenciasIniciales={licencias} />
        )}
      </div>
    </main>
  );
}
