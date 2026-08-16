"use client";

// Fase 6/7 (PLAN_EJECUCION.md): modal de checkout que arma el mensaje y abre wa.me.

import { useState, type FormEvent } from "react";
import { CloseIcon, WhatsappIcon } from "@/components/icons";
import type { CartItem } from "@/hooks/useCart";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { formatCOP } from "@/lib/utils";
import { buildWhatsappUrl } from "@/lib/whatsapp";

const METODOS_PAGO = ["Nequi", "Daviplata", "Efectivo"] as const;

export function CheckoutModal({
  open,
  onClose,
  items,
  total,
  tiendaNombre,
  telefonoWhatsapp,
  onConfirmado,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  tiendaNombre: string;
  telefonoWhatsapp: string;
  onConfirmado: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState<string>(METODOS_PAGO[0]);
  useBodyScrollLock(open);

  if (!open) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const url = buildWhatsappUrl(telefonoWhatsapp, {
      tiendaNombre,
      clienteNombre: nombre,
      direccion,
      metodoPago,
      items: items.map((item) => ({
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        subtotal: item.producto.precio * item.cantidad,
      })),
      total,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    onConfirmado();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Finalizar pedido"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative w-full max-w-md rounded-t-2xl border border-line bg-surface p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">Finalizar pedido</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-ink-faint hover:text-ink"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-nombre" className="text-sm font-semibold text-ink-soft">
              Nombre
            </label>
            <input
              id="checkout-nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="rounded-md border border-line-strong bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-direccion" className="text-sm font-semibold text-ink-soft">
              Dirección de entrega
            </label>
            <input
              id="checkout-direccion"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, barrio"
              className="rounded-md border border-line-strong bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink-soft">Método de pago</span>
            <div className="flex flex-wrap gap-2">
              {METODOS_PAGO.map((metodo) => (
                <button
                  key={metodo}
                  type="button"
                  onClick={() => setMetodoPago(metodo)}
                  className={`rounded-md border px-3.5 py-2 text-sm font-semibold transition-colors ${
                    metodoPago === metodo
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line-strong text-ink-soft hover:bg-ink/5"
                  }`}
                >
                  {metodo}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
            <span className="text-ink-soft">Total</span>
            <span className="font-display text-lg tabular-nums">{formatCOP(total)}</span>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-md bg-wa px-5 py-3 text-sm font-bold text-wa-ink transition-colors hover:bg-wa/90"
          >
            <WhatsappIcon />
            Enviar pedido por WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
