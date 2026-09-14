// Convención de Next.js App Router: se muestra automáticamente mientras el
// Server Component de la ruta espera datos (Supabase). Es un esqueleto con
// la forma real del panel (no un spinner genérico) para que en conexiones
// lentas se sienta que algo se está cargando, no que la app se congeló.
// Deliberadamente sin librerías nuevas (Regla de Oro #1) — solo Tailwind.
export default function DashboardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden="true">
      <div className="h-20 rounded-xl bg-surface-2" />
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 rounded bg-surface-2" />
        <div className="h-10 w-32 rounded-md bg-surface-2" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-line">
            <div className="aspect-square bg-surface-2" />
            <div className="flex flex-col gap-2 p-3.5">
              <div className="h-4 w-3/4 rounded bg-surface-2" />
              <div className="h-4 w-1/2 rounded bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
