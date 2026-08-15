"use client";

// Fase 6 (PLAN_EJECUCION.md): carrito flotante con badge, total y checkout.

import { useState } from "react";
import { CartIcon, CloseIcon, MinusIcon, PlusIcon } from "@/components/icons";
import type { CartItem } from "@/hooks/useCart";
import { formatCOP } from "@/lib/utils";

export function CartDrawer({
  items,
  total,
  cantidadTotal,
  onIncrement,
  onDecrement,
  onCheckout,
}: {
  items: CartItem[];
  total: number;
  cantidadTotal: number;
  onIncrement: (productoId: string) => void;
  onDecrement: (productoId: string) => void;
  onCheckout: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (cantidadTotal === 0) return null;

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar carrito"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40"
        />
      )}
      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-3 px-4 pb-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end sm:px-0 sm:pb-0">
        {open && (
          <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-[0_16px_40px_-16px_rgba(27,36,48,0.5)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base">Tu pedido</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="text-ink-faint hover:text-ink"
              >
                <CloseIcon width={18} height={18} />
              </button>
            </div>

            <ul className="flex max-h-64 flex-col gap-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.producto.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{item.producto.nombre}</p>
                    <p className="text-xs text-ink-faint">{formatCOP(item.producto.precio)} c/u</p>
                  </div>
                  <div className="flex flex-none items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDecrement(item.producto.id)}
                      aria-label={`Restar ${item.producto.nombre}`}
                      className="flex h-6 w-6 items-center justify-center rounded border border-line-strong hover:bg-ink/5"
                    >
                      <MinusIcon width={12} height={12} />
                    </button>
                    <span className="w-4 text-center text-sm tabular-nums">{item.cantidad}</span>
                    <button
                      type="button"
                      onClick={() => onIncrement(item.producto.id)}
                      aria-label={`Sumar ${item.producto.nombre}`}
                      className="flex h-6 w-6 items-center justify-center rounded border border-line-strong hover:bg-ink/5"
                    >
                      <PlusIcon width={12} height={12} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="font-display text-lg tabular-nums">{formatCOP(total)}</span>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="mt-3 w-full rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
            >
              Pedir por WhatsApp
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-ink shadow-[0_16px_32px_-12px_rgba(27,36,48,0.55)] transition-colors hover:bg-accent/90"
        >
          <CartIcon />
          <span className="tabular-nums">{cantidadTotal}</span>
          <span className="tabular-nums">{formatCOP(total)}</span>
        </button>
      </div>
    </>
  );
}
