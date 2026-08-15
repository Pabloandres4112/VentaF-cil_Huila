// Fase 5 (PLAN_EJECUCION.md): tarjeta de producto del catálogo público.

import type { Producto } from "@/types";

export function ProductCard({ producto }: { producto: Producto }) {
  return (
    <article className="rounded-lg border p-3">
      <h3 className="font-medium">{producto.nombre}</h3>
      <p className="text-sm text-neutral-500">${producto.precio}</p>
    </article>
  );
}
