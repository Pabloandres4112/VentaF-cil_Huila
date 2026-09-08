// Convención de Next.js App Router: se muestra mientras se consulta la
// tienda y sus productos en Supabase. Esqueleto con la forma real del
// catálogo (header + tarjetas) en vez de un spinner — se ve más vivo en
// conexiones lentas. Sin librerías nuevas (Regla de Oro #1), solo Tailwind.
export default function StoreLoading() {
  return (
    <main className="flex-1 animate-pulse bg-ground pb-28" aria-hidden="true">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-284 items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-11 w-11 flex-none rounded-full bg-surface-2" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-32 rounded bg-surface-2" />
              <div className="h-3 w-24 rounded bg-surface-2" />
            </div>
          </div>
          <div className="h-9 w-24 flex-none rounded-full bg-surface-2" />
        </div>
      </header>
      <div className="mx-auto max-w-284 px-5 py-6 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
              <div className="aspect-square bg-surface-2" />
              <div className="flex flex-col gap-2 p-3.5">
                <div className="h-4 w-3/4 rounded bg-surface-2" />
                <div className="h-4 w-1/2 rounded bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
