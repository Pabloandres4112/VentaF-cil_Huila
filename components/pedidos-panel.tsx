"use client";

// Control de pedidos — historial de lo pedido desde el catálogo público
// (ver checkout-modal.tsx, que guarda cada pedido al momento de comprar) con
// un selector de estado para que el dueño lleve control de cuáles ya
// despachó o canceló.

import { useState, useTransition } from "react";
import { SearchBox } from "@/components/search-box";
import { coincideBusqueda, formatCOP } from "@/lib/utils";
import { actualizarEstadoPedido } from "@/services/pedidos";
import type { EstadoPedido, Pedido } from "@/types";

const ESTADO_STYLES: Record<EstadoPedido, string> = {
  pendiente: "bg-surface-2 text-ink-faint",
  completado: "bg-wa-tint text-wa-deep",
  cancelado: "bg-danger/10 text-danger",
};

const ESTADO_LABELS: Record<EstadoPedido, string> = {
  pendiente: "Pendiente",
  completado: "Completado",
  cancelado: "Cancelado",
};

type FiltroEstado = EstadoPedido | "todos";

const FILTROS: { valor: FiltroEstado; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "pendiente", label: "Pendiente" },
  { valor: "completado", label: "Completado" },
  { valor: "cancelado", label: "Cancelado" },
];

function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function PedidosPanel({ pedidosIniciales }: { pedidosIniciales: Pedido[] }) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const pedidosFiltrados = pedidos.filter(
    (p) =>
      (filtroEstado === "todos" || p.estado === filtroEstado) &&
      coincideBusqueda(busqueda, p.cliente_nombre, p.referencia, p.cliente_direccion),
  );

  function handleCambiarEstado(id: string, estado: EstadoPedido) {
    const anterior = pedidos;
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
    startTransition(async () => {
      try {
        await actualizarEstadoPedido(id, estado);
        setError(null);
      } catch {
        setPedidos(anterior);
        setError("No se pudo cambiar el estado. Intenta de nuevo.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-xl">
          Pedidos <span className="text-ink-faint">· {pedidos.length}</span>
        </h1>
        <p className="text-sm text-ink-soft">
          Historial de lo pedido desde tu catálogo público — se guarda automáticamente cada vez
          que alguien completa una compra.
        </p>
      </div>

      {pedidos.length > 0 && (
        <div className="flex flex-col gap-3">
          <SearchBox
            value={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por cliente, referencia o dirección..."
          />
          <div className="flex flex-wrap gap-2">
            {FILTROS.map((filtro) => (
              <button
                key={filtro.valor}
                type="button"
                onClick={() => setFiltroEstado(filtro.valor)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  filtroEstado === filtro.valor
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line-strong text-ink-soft hover:bg-ink/5"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {pedidos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong py-12 text-center text-sm text-ink-soft">
          Todavía no tienes pedidos. Aparecerán acá apenas alguien compre desde tu catálogo.
        </p>
      ) : pedidosFiltrados.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong py-12 text-center text-sm text-ink-soft">
          {busqueda
            ? `Ningún pedido coincide con "${busqueda}".`
            : `No tienes pedidos en estado "${ESTADO_LABELS[filtroEstado as EstadoPedido]}".`}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-sm">
                    #{pedido.referencia}{" "}
                    <span className="font-sans text-xs font-normal text-ink-faint">
                      · {formatFecha(pedido.created_at)}
                    </span>
                  </p>
                  <p className="text-sm font-semibold">{pedido.cliente_nombre}</p>
                  <p className="text-xs text-ink-faint">{pedido.cliente_direccion}</p>
                </div>

                <select
                  value={pedido.estado}
                  onChange={(e) =>
                    handleCambiarEstado(pedido.id, e.target.value as EstadoPedido)
                  }
                  aria-label={`Estado del pedido de ${pedido.cliente_nombre}`}
                  className={`rounded-md border-0 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide outline-none ${ESTADO_STYLES[pedido.estado]}`}
                >
                  {(Object.keys(ESTADO_LABELS) as EstadoPedido[]).map((estado) => (
                    <option key={estado} value={estado}>
                      {ESTADO_LABELS[estado]}
                    </option>
                  ))}
                </select>
              </div>

              <ul className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm text-ink-soft">
                {pedido.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="truncate">
                      {item.cantidad}x {item.nombre}
                    </span>
                    <span className="flex-none tabular-nums">{formatCOP(item.subtotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                <span className="text-ink-faint">{pedido.metodo_pago}</span>
                <span className="font-display tabular-nums">{formatCOP(pedido.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
