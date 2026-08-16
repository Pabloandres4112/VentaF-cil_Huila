// Fase 5 (PLAN_EJECUCION.md): catálogo público del cliente final.
// Usa datos de ejemplo (lib/mock-data.ts) hasta que exista el proyecto de
// Supabase (Fase 1, en pausa a propósito) — para entonces, reemplazar por
// getTiendaByCode / getProductosByTiendaId (services/store.ts y products.ts).

import { getMockTiendaByCode, MOCK_PRODUCTOS } from "@/lib/mock-data";
import { StoreCatalog } from "@/components/store-catalog";
import { WhatsappIcon } from "@/components/icons";

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
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-284 items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent font-display text-base text-accent-ink">
              {tienda.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-display truncate text-lg leading-tight">{tienda.nombre}</p>
              <p className="truncate text-xs text-ink-faint">
                Catálogo digital · {productos.length}{" "}
                {productos.length === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/${tienda.telefono_whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-none items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-xs font-bold text-ink-soft transition-colors hover:bg-ink/5 sm:text-sm"
          >
            <WhatsappIcon className="text-wa-deep" />
            <span className="hidden sm:inline">Escríbenos</span>
          </a>
        </div>
      </header>
      <div className="mx-auto max-w-284 px-5 py-6 sm:px-8">
        <StoreCatalog tienda={tienda} productos={productos} />
      </div>
    </main>
  );
}
