"use client";

// Fase 6/7 (PLAN_EJECUCION.md): modal de checkout que arma el mensaje y abre wa.me.

import { useState, type FormEvent } from "react";
import { CloseIcon, WhatsappIcon } from "@/components/icons";
import type { CartItem } from "@/hooks/useCart";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { formatCOP } from "@/lib/utils";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { descontarStockPedido } from "@/services/products";

const METODOS_PAGO = ["Nequi", "Daviplata", "Efectivo"] as const;

interface CheckoutErrors {
  nombre?: string;
  direccion?: string;
  general?: string;
}

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
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [enviando, setEnviando] = useState(false);
  useBodyScrollLock(open);

  if (!open) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: CheckoutErrors = {};
    if (nombre.trim().length < 2) nextErrors.nombre = "Ingresa tu nombre completo.";
    if (direccion.trim().length < 5) nextErrors.direccion = "Ingresa una dirección válida.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setEnviando(true);
    // Se descuenta el stock justo aquí, antes de abrir WhatsApp — es lo más
    // cercano a "se vendió" que se puede detectar, porque después de esto el
    // pedido ya no vuelve a tocar el servidor. Si alguien más se llevó la
    // última unidad hace un segundo, esto lo atrapa antes de prometer algo
    // que ya no hay.
    let resultado: { ok: boolean; agotados: string[] };
    try {
      resultado = await descontarStockPedido(
        items.map((item) => ({ productoId: item.producto.id, cantidad: item.cantidad })),
      );
    } catch {
      setEnviando(false);
      setErrors({ general: "No se pudo confirmar el pedido. Intenta de nuevo." });
      return;
    }
    setEnviando(false);

    if (!resultado.ok) {
      const nombresAgotados = items
        .filter((item) => resultado.agotados.includes(item.producto.id))
        .map((item) => item.producto.nombre)
        .join(", ");
      setErrors({
        general: `Justo se agotó: ${nombresAgotados}. Ajusta la cantidad o quítalo del carrito para continuar.`,
      });
      return;
    }

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

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-nombre" className="text-sm font-semibold text-ink-soft">
              Nombre
            </label>
            <input
              id="checkout-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              aria-invalid={Boolean(errors.nombre)}
              className={`rounded-md border bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent ${errors.nombre ? "border-danger" : "border-line-strong"}`}
            />
            {errors.nombre && <p className="text-xs text-danger">{errors.nombre}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-direccion" className="text-sm font-semibold text-ink-soft">
              Dirección de entrega
            </label>
            <input
              id="checkout-direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, barrio"
              aria-invalid={Boolean(errors.direccion)}
              className={`rounded-md border bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent ${errors.direccion ? "border-danger" : "border-line-strong"}`}
            />
            {errors.direccion && <p className="text-xs text-danger">{errors.direccion}</p>}
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

          {errors.general && <p className="text-sm text-danger">{errors.general}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="flex items-center justify-center gap-2 rounded-md bg-wa px-5 py-3 text-sm font-bold text-wa-ink transition-colors hover:bg-wa/90 disabled:opacity-60"
          >
            <WhatsappIcon />
            {enviando ? "Confirmando..." : "Enviar pedido por WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
