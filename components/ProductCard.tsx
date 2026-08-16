// Fase 5 (PLAN_EJECUCION.md): tarjeta de producto del catálogo público.

import { ImagePlaceholderIcon, PlusIcon } from "@/components/icons";
import type { Producto } from "@/types";
import { formatCOP } from "@/lib/utils";

export function ProductCard({
  producto,
  onAdd,
}: {
  producto: Producto;
  onAdd: (producto: Producto) => void;
}) {
  const agotado = producto.stock <= 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <div className="relative aspect-square bg-surface-2">
        {producto.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- imagen remota de Supabase Storage, sin dominio configurado aún
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="absolute inset-0 h-full w-full object-contain p-3"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-faint">
            <ImagePlaceholderIcon width={28} height={28} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-[2.4rem] text-sm font-semibold leading-snug">
            {producto.nombre}
          </h3>
          {agotado && (
            <span className="flex-none whitespace-nowrap rounded bg-surface-2 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-faint">
              Sin stock
            </span>
          )}
        </div>
        <p className="line-clamp-1 min-h-4 text-xs text-ink-faint">
          {producto.descripcion ?? ""}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="font-display text-lg tabular-nums">{formatCOP(producto.precio)}</span>
          <button
            type="button"
            onClick={() => onAdd(producto)}
            disabled={agotado}
            aria-label={`Agregar ${producto.nombre} al carrito`}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-accent text-accent-ink transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-faint"
          >
            <PlusIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
