"use client";

// Fase 6 (PLAN_EJECUCION.md): carrito — bottom sheet en mobile, panel flotante en desktop.

import { useRef, useState } from "react";
import {
  CartIcon,
  CloseIcon,
  ImagePlaceholderIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";
import type { CartItem } from "@/hooks/useCart";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalA11y } from "@/hooks/useModalA11y";
import { formatCOP, precioEfectivo } from "@/lib/utils";

export function CartDrawer({
  items,
  total,
  cantidadTotal,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}: {
  items: CartItem[];
  total: number;
  cantidadTotal: number;
  onIncrement: (productoId: string) => void;
  onDecrement: (productoId: string) => void;
  onRemove: (productoId: string) => void;
  onCheckout: () => void;
}) {
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalA11y(dialogRef, open, () => setOpen(false));

  if (cantidadTotal === 0) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar carrito"
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-ink/50 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={dialogRef}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className={`fixed inset-0 z-40 flex h-dvh w-full flex-col overflow-hidden bg-surface transition-transform duration-300 ease-out sm:inset-auto sm:right-6 sm:bottom-6 sm:h-auto sm:max-h-144 sm:w-full sm:max-w-md sm:rounded-2xl sm:border sm:border-line sm:shadow-[0_24px_48px_-20px_rgba(27,36,48,0.55)] ${
          open
            ? "translate-y-0"
            : "pointer-events-none translate-y-full sm:translate-y-6 sm:opacity-0"
        }`}
      >
        <div className="flex flex-none justify-center pb-1 pt-3 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-line-strong" />
        </div>

        <div className="flex flex-none items-center justify-between px-5 pb-3 pt-2 sm:pt-5">
          <div>
            <h3 className="font-display text-lg leading-tight">Tu pedido</h3>
            <p className="text-xs text-ink-faint">
              {cantidadTotal} {cantidadTotal === 1 ? "producto" : "productos"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-soft transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </div>

        <ul className="flex flex-1 flex-col divide-y divide-line overflow-y-auto overscroll-contain border-t border-line px-5">
          {items.map((item) => {
            const unitario = precioEfectivo(item.producto);
            const enOferta = Boolean(item.producto.precio_descuento);
            const sinMasStock = item.cantidad >= item.producto.stock;

            return (
              <li key={item.producto.id} className="flex gap-3.5 py-4">
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl border border-line bg-surface-2">
                  {item.producto.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- imagen remota, sin dominio configurado aún
                    <img
                      src={item.producto.imagen_url}
                      alt={item.producto.nombre}
                      className="absolute inset-0 h-full w-full object-contain p-1.5"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-ink-faint">
                      <ImagePlaceholderIcon width={20} height={20} />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug">
                      {item.producto.nombre}
                    </p>
                    <p className="flex-none text-sm font-bold tabular-nums">
                      {formatCOP(unitario * item.cantidad)}
                    </p>
                  </div>

                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-faint">
                    <span className="tabular-nums">{formatCOP(unitario)} c/u</span>
                    {enOferta && (
                      <span className="tabular-nums line-through">
                        {formatCOP(item.producto.precio)}
                      </span>
                    )}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center rounded-full border border-line-strong">
                      <button
                        type="button"
                        onClick={() => onDecrement(item.producto.id)}
                        aria-label={`Restar ${item.producto.nombre}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
                      >
                        <MinusIcon width={12} height={12} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold tabular-nums">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncrement(item.producto.id)}
                        disabled={sinMasStock}
                        aria-label={`Sumar ${item.producto.nombre}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <PlusIcon width={12} height={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(item.producto.id)}
                      aria-label={`Eliminar ${item.producto.nombre} del carrito`}
                      className="flex items-center gap-1 text-xs font-semibold text-ink-faint transition-colors hover:text-danger"
                    >
                      <TrashIcon width={13} height={13} />
                      Quitar
                    </button>
                  </div>

                  {sinMasStock && (
                    <p className="mt-1.5 text-xs text-ink-faint">Llegaste al stock disponible.</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex-none border-t border-line bg-surface-2/60 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:pb-5">
          <div className="mb-1 flex items-center justify-between text-sm text-ink-soft">
            <span>Productos ({cantidadTotal})</span>
            <span className="tabular-nums">{formatCOP(total)}</span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="font-display text-xl tabular-nums">{formatCOP(total)}</span>
          </div>

          <button
            type="button"
            onClick={onCheckout}
            className="w-full rounded-lg bg-accent px-4 py-3.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
          >
            Finalizar pedido
          </button>
          <p className="mt-2.5 text-center text-xs text-ink-faint">
            El pago y la entrega los acuerdas directamente con la tienda por WhatsApp.
          </p>
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
          <span>Ver pedido</span>
          <span className="tabular-nums opacity-90">{formatCOP(total)}</span>
        </button>
      )}
    </>
  );
}
