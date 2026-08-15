// Fase 5 (PLAN_EJECUCION.md): catálogo público del cliente final.
// Usa datos de ejemplo (lib/mock-data.ts) hasta que exista el proyecto de
// Supabase (Fase 1, en pausa a propósito) — para entonces, reemplazar por
// getTiendaByCode / getProductosByTiendaId (services/store.ts y products.ts).

import { getMockTiendaByCode, MOCK_PRODUCTOS } from "@/lib/mock-data";
import { StoreCatalog } from "@/components/store-catalog";

export default async function StorePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const tienda = getMockTiendaByCode(code);

  if (!tienda) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h1 className="font-display text-xl">Tienda no encontrada</h1>
        <p className="mt-2 text-sm text-ink-soft">Revisa el link e intenta de nuevo.</p>
      </main>
    );
  }

  if (tienda.estado_suscripcion === "Inactivo") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h1 className="font-display text-xl">Tienda no disponible temporalmente</h1>
      </main>
    );
  }

  const productos = MOCK_PRODUCTOS.filter((producto) => producto.disponible);

  return (
    <main className="flex-1 bg-ground pb-28">
      <header className="border-b border-line bg-surface px-5 py-6 sm:px-8">
        <p className="font-display text-xl">{tienda.nombre}</p>
        <p className="text-sm text-ink-faint">Catálogo digital</p>
      </header>
      <div className="px-5 py-6 sm:px-8">
        <StoreCatalog tienda={tienda} productos={productos} />
      </div>
    </main>
  );
}
