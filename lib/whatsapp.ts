// Fase 7 (PLAN_EJECUCION.md): generador del mensaje de pedido y enlace wa.me.

import { formatCOP } from "@/lib/utils";

export interface ItemPedido {
  nombre: string;
  cantidad: number;
  subtotal: number;
}

export interface DatosPedido {
  referencia: string;
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

// Referencia corta compartida entre el mensaje de WhatsApp y la fila que se
// guarda en `pedidos` (services/pedidos.ts) — así el dueño puede relacionar
// lo que le llegó al chat con lo que ve en /dashboard/pedidos de un vistazo.
export function generarReferenciaPedido(): string {
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
    `Pedido #${datos.referencia} · ${formatFechaHora(new Date())}`,
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
