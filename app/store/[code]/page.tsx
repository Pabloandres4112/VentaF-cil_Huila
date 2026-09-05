// Fase 5 (PLAN_EJECUCION.md): catálogo público del cliente final.

import Link from "next/link";
import type { CSSProperties } from "react";
import { StoreCatalog } from "@/components/store-catalog";
import { StoreIcon, WhatsappIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { pickContrastingInk } from "@/lib/utils";
import { getProductosByTiendaId } from "@/services/products";
import { getTiendaByCode } from "@/services/store";

export default async function StorePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const tienda = await getTiendaByCode(code);

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

  const todosLosProductos = await getProductosByTiendaId(tienda.id);
  const productos = todosLosProductos.filter((producto) => producto.disponible);

  // Si quien mira el catálogo es el dueño logueado de esta misma tienda, se
  // le muestra un atajo para volver a su panel sin tener que navegar hacia
  // atrás manualmente. Cualquier otro visitante (o nadie logueado) no ve nada
  // distinto — es un extra solo para el propio dueño revisando su vista pública.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const esDuenio = user?.id === tienda.user_id;

  // Personalización de marca (Fase 4b, PLAN_EJECUCION.md): el dueño solo
  // puede cambiar nombre + estos 2 colores — nunca el verde de WhatsApp
  // (--wa*), que se mantiene fijo en toda la app a propósito. La tinta del
  // texto/ícono se calcula según el color elegido (no según el tema
  // claro/oscuro) para que siga siendo legible sin importar qué tan claro u
  // oscuro sea el color que el dueño escoja.
  const colorVars = {
    ...(tienda.color_primario
      ? { "--accent": tienda.color_primario, "--accent-ink": pickContrastingInk(tienda.color_primario) }
      : {}),
    ...(tienda.color_secundario
      ? {
          "--accent-2": tienda.color_secundario,
          "--accent-2-ink": pickContrastingInk(tienda.color_secundario),
        }
      : {}),
    ...(tienda.color_fondo ? { "--ground": tienda.color_fondo } : {}),
  } as CSSProperties;

  return (
    <main className="flex-1 bg-ground pb-28" style={colorVars}>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-284 items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent-2 font-display text-base text-accent-2-ink">
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
          <div className="flex flex-none items-center gap-2">
            {esDuenio && (
              <Link
                href="/dashboard"
                aria-label="Volver al panel"
                title="Volver al panel"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink-soft transition-colors hover:bg-ink/5"
              >
                <StoreIcon width={16} height={16} />
              </Link>
            )}
            <a
              href={`https://wa.me/${tienda.telefono_whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-xs font-bold text-ink-soft transition-colors hover:bg-ink/5 sm:text-sm"
            >
              <WhatsappIcon className="text-wa-deep" />
              <span className="hidden sm:inline">Escríbenos</span>
            </a>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-284 px-5 py-6 sm:px-8">
        <StoreCatalog tienda={tienda} productos={productos} />
      </div>
    </main>
  );
}
