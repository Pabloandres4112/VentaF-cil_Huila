"use client";

// Fase 4 (PLAN_EJECUCION.md): formulario de creación/edición de producto (panel admin).

import type { Producto } from "@/types";

export function ProductForm({ producto }: { producto?: Producto }) {
  return (
    <form className="flex flex-col gap-2">
      <input
        name="nombre"
        placeholder="Nombre del producto"
        defaultValue={producto?.nombre}
        className="rounded border px-3 py-2"
      />
    </form>
  );
}
