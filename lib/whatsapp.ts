// Fase 7 (PLAN_EJECUCION.md): generador del mensaje de pedido y enlace wa.me.

import { formatCOP } from "@/lib/utils";

export interface ItemPedido {
  nombre: string;
  cantidad: number;
  subtotal: number;
}

export interface DatosPedido {
  tiendaNombre: string;
  clienteNombre: string;
  direccion: string;
  metodoPago: string;
  items: ItemPedido[];
  total: number;
}

export function buildWhatsappUrl(telefonoWhatsapp: string, datos: DatosPedido): string {
  const mensaje = formatPedidoMensaje(datos);
  return `https://wa.me/${telefonoWhatsapp}?text=${encodeURIComponent(mensaje)}`;
}

const SEPARADOR = "----------------------";

// Referencia corta (no es un ID de base de datos — no existe tabla `pedidos`
// en el MVP a propósito) solo para que el dueño pueda diferenciar pedidos
// seguidos en el chat de un vistazo, sin tener que leer el detalle completo.
function generarReferencia(): string {
  return Date.now().toString(36).slice(-4).toUpperCase();
}

function formatFechaHora(fecha: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(fecha);
}

function formatPedidoMensaje(datos: DatosPedido): string {
  const detalle = datos.items
    .map((item, i) => `${i + 1}. ${item.cantidad}x ${item.nombre} — ${formatCOP(item.subtotal)}`)
    .join("\n");

  return [
    `*Nuevo pedido — VentaFácil*`,
    `Pedido #${generarReferencia()} · ${formatFechaHora(new Date())}`,
    SEPARADOR,
    `*Cliente:* ${datos.clienteNombre}`,
    `*Dirección:* ${datos.direccion}`,
    `*Pago:* ${datos.metodoPago}`,
    SEPARADOR,
    `*Detalle del pedido:*`,
    detalle,
    SEPARADOR,
    `*Total a pagar:* ${formatCOP(datos.total)}`,
    ``,
    `_Enviado desde el catálogo digital de ${datos.tiendaNombre}._`,
  ].join("\n");
}
