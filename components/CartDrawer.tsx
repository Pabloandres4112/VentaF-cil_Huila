"use client";

// Fase 6 (PLAN_EJECUCION.md): carrito — bottom sheet en mobile, panel flotante en desktop.

import { useState } from "react";
import { CartIcon, CloseIcon, ImagePlaceholderIcon, MinusIcon, PlusIcon } from "@/components/icons";
import type { CartItem } from "@/hooks/useCart";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
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
  useBodyScrollLock(open);

  if (cantidadTotal === 0) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-ink/50 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className={`fixed inset-0 z-40 flex h-dvh w-full flex-col overflow-hidden bg-surface transition-transform duration-300 ease-out sm:inset-auto sm:right-6 sm:bottom-6 sm:h-auto sm:max-h-120 sm:w-full sm:max-w-sm sm:rounded-2xl sm:border sm:border-line sm:shadow-[0_24px_48px_-20px_rgba(27,36,48,0.55)] ${
          open
            ? "translate-y-0"
            : "pointer-events-none translate-y-full sm:translate-y-6 sm:opacity-0"
        }`}
      >
        <div className="flex flex-none justify-center pb-1 pt-3 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-line-strong" />
        </div>

        <div className="flex flex-none items-center justify-between border-b border-line px-5 py-3.5 sm:py-4">
          <h3 className="font-display text-base">
            Tu pedido <span className="text-ink-faint">· {cantidadTotal}</span>
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <ul className="flex flex-1 flex-col divide-y divide-line overflow-y-auto overscroll-contain px-5">
          {items.map((item) => (
            <li key={item.producto.id} className="flex items-center gap-3 py-3.5">
              <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-surface-2">
                {item.producto.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- imagen remota, sin dominio configurado aún
                  <img
                    src={item.producto.imagen_url}
                    alt={item.producto.nombre}
                    className="absolute inset-0 h-full w-full object-contain p-1"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-ink-faint">
                    <ImagePlaceholderIcon width={18} height={18} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.producto.nombre}</p>
                <p className="text-xs text-ink-faint">
                  {formatCOP(item.producto.precio)} ·{" "}
                  {formatCOP(item.producto.precio * item.cantidad)}
                </p>
              </div>

              <div className="flex flex-none items-center gap-1 rounded-full bg-surface-2 p-1">
                <button
                  type="button"
                  onClick={() => onDecrement(item.producto.id)}
                  aria-label={`Restar ${item.producto.nombre}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-ink-soft transition-colors hover:bg-ink/10"
                >
                  <MinusIcon width={12} height={12} />
                </button>
                <span className="w-4 text-center text-sm tabular-nums">{item.cantidad}</span>
                <button
                  type="button"
                  onClick={() => onIncrement(item.producto.id)}
                  aria-label={`Sumar ${item.producto.nombre}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-ink-soft transition-colors hover:bg-ink/10"
                >
                  <PlusIcon width={12} height={12} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex-none border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:pb-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-ink-soft">Total</span>
            <span className="font-display text-lg tabular-nums">{formatCOP(total)}</span>
          </div>

          <button
            type="button"
            onClick={onCheckout}
            className="w-full rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
          >
            Pedir por WhatsApp
          </button>
        </div>
      </div>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed inset-x-0 bottom-4 z-20 mx-auto flex w-fit items-center gap-2.5 rounded-full bg-accent py-3 pl-4 pr-5 text-sm font-bold text-accent-ink shadow-[0_16px_32px_-12px_rgba(27,36,48,0.55)] transition-colors hover:bg-accent/90 sm:inset-x-auto sm:right-6 sm:bottom-6"
        >
          <span className="relative flex-none">
            <CartIcon width={19} height={19} />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-ink px-1 text-[0.6rem] font-bold text-accent tabular-nums">
              {cantidadTotal}
            </span>
          </span>
          <span className="tabular-nums">{formatCOP(total)}</span>
        </button>
      )}
    </>
  );
}
