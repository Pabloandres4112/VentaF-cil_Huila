// Convención de Next.js: se muestra mientras isSuperadmin()/listar* resuelven
// (ver app/admin/layout.tsx y las páginas de tiendas/licencias). Esqueleto
// de lista de tarjetas — la forma real de ambas vistas de /admin.
export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-284 animate-pulse px-5 py-8 sm:px-8" aria-hidden="true">
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-6 w-40 rounded bg-surface-2" />
        <div className="h-4 w-72 rounded bg-surface-2" />
      </div>
      <div className="mb-4 h-10 rounded-md bg-surface-2" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl border border-line bg-surface-2/60" />
        ))}
      </div>
    </div>
  );
}
