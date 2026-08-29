import { redirect } from "next/navigation";
import { isSuperadmin } from "@/lib/auth/superadmin";
import { LicenciasPanel } from "@/components/licencias-panel";

// Sistema de Licencias (multi-producto) — ver PLAN_EJECUCION.md, anexo
// "Sistema de Licencias". Ruta cargada bajo demanda dentro del mismo router
// de la app (no es un proyecto aparte). Verificación server-side: si no es
// superadmin, ni siquiera se envía el HTML del panel al navegador.
export default async function LicenciasPage() {
  const autorizado = await isSuperadmin();
  if (!autorizado) redirect("/");

  return (
    <main className="min-h-full flex-1 bg-ground">
      <div className="mx-auto max-w-284 px-5 py-8 sm:px-8">
        <LicenciasPanel />
      </div>
    </main>
  );
}
