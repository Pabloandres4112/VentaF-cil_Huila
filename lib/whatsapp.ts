// Fase 7 (PLAN_EJECUCION.md): generador del mensaje de pedido y enlace wa.me.

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

function formatPedidoMensaje(datos: DatosPedido): string {
  const detalle = datos.items
    .map((item) => `• ${item.cantidad}x ${item.nombre} ($${item.subtotal})`)
    .join("\n");

  return [
    `*Nuevo pedido — VentaFácil*`,
    ``,
    `*Cliente:* ${datos.clienteNombre}`,
    `*Dirección:* ${datos.direccion}`,
    `*Pago:* ${datos.metodoPago}`,
    ``,
    `*Detalle del pedido:*`,
    detalle,
    ``,
    `*Total a pagar:* $${datos.total}`,
    ``,
    `_Enviado desde el catálogo digital de ${datos.tiendaNombre}._`,
  ].join("\n");
}
