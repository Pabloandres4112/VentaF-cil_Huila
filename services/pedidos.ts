"use server";

// Control de pedidos (dashboard/pedidos.tsx). Antes del checkout el pedido
// solo existía como mensaje de WhatsApp; ahora se guarda una copia acá para
// que el dueño tenga historial. Quien crea un pedido (checkout-modal.tsx) es
// un comprador anónimo sin sesión — por eso crearPedido no exige auth, pero
// listar/actualizar sí quedan detrás de RLS ("solo el dueño ve/cambia sus
// pedidos", ver supabase/schema.sql).

import { puedeContinuar } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { precioEfectivo } from "@/lib/utils";
import type { EstadoPedido, ItemPedidoGuardado, Pedido } from "@/types";

export interface NuevoPedido {
  referencia: string;
  cliente_nombre: string;
  cliente_direccion: string;
  metodo_pago: string;
  items: ItemPedidoGuardado[];
  total: number;
}

function texto(valor: unknown, maximo: number): string {
  return typeof valor === "string" ? valor.trim().slice(0, maximo) : "";
}

// Lo que llega del navegador no es de fiar: un comprador podía mandar precios
// o un total inventados y quedaban guardados tal cual. Aquí se toma del
// cliente solo QUÉ productos y CUÁNTOS, y el nombre, el precio (con oferta si
// la hay), el subtotal y el total se recalculan desde la base de datos.
export async function crearPedido(tiendaId: string, datos: NuevoPedido): Promise<void> {
  if (!(await puedeContinuar("pedido", 15, 600))) throw new Error("Demasiados intentos");

  const nombre = texto(datos.cliente_nombre, 120);
  const direccion = texto(datos.cliente_direccion, 300);
  const metodoPago = texto(datos.metodo_pago, 40);
  const referencia = texto(datos.referencia, 20);
  if (nombre.length < 2 || direccion.length < 5 || !metodoPago || !referencia) {
    throw new Error("Pedido inválido");
  }

  const solicitados = Array.isArray(datos.items) ? datos.items : [];
  if (
    solicitados.length === 0 ||
    solicitados.length > 50 ||
    solicitados.some(
      (i) =>
        typeof i.producto_id !== "string" ||
        !Number.isInteger(i.cantidad) ||
        i.cantidad < 1 ||
        i.cantidad > 999,
    )
  ) {
    throw new Error("Pedido inválido");
  }

  const supabase = await createClient();
  const ids = [...new Set(solicitados.map((i) => i.producto_id as string))];
  const { data: productos, error: errorProductos } = await supabase
    .from("productos")
    .select("id, tienda_id, nombre, precio, precio_descuento")
    .in("id", ids);
  if (errorProductos) throw errorProductos;

  const items: ItemPedidoGuardado[] = solicitados.map((solicitado) => {
    const producto = productos?.find((p) => p.id === solicitado.producto_id);
    if (!producto || producto.tienda_id !== tiendaId) throw new Error("Pedido inválido");
    const precioUnitario = precioEfectivo({
      precio: Number(producto.precio),
      precio_descuento: producto.precio_descuento === null ? null : Number(producto.precio_descuento),
    });
    return {
      producto_id: producto.id,
      nombre: producto.nombre,
      cantidad: solicitado.cantidad,
      precio_unitario: precioUnitario,
      subtotal: precioUnitario * solicitado.cantidad,
    };
  });
  const total = items.reduce((suma, item) => suma + item.subtotal, 0);

  const { error } = await supabase.from("pedidos").insert({
    tienda_id: tiendaId,
    referencia,
    cliente_nombre: nombre,
    cliente_direccion: direccion,
    metodo_pago: metodoPago,
    items,
    total,
  });
  if (error) throw error;
}

export async function listarPedidosByTiendaId(tiendaId: string): Promise<Pedido[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pedidos")
    .select("*")
    .eq("tienda_id", tiendaId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

// Si se cancela un pedido que no estaba cancelado antes, se devuelve el
// stock de sus productos: el descuento pasa en el checkout, antes de que
// comprador y vendedor terminen de ponerse de acuerdo por WhatsApp — si el
// trato no se cierra, esa venta nunca pasó de verdad y el stock debe
// volver. Items sin producto_id (pedidos viejos, o el producto ya se
// borró) simplemente se saltan — no hay a qué producto devolverle el stock.
// A propósito no pasa lo contrario (si se "descancela" un pedido no se
// vuelve a descontar) — es una corrección manual del dueño, no algo que
// deba pasar solo.
export async function actualizarEstadoPedido(id: string, estado: EstadoPedido): Promise<void> {
  const supabase = await createClient();

  const { data: pedidoActual } = await supabase
    .from("pedidos")
    .select("estado, items")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("pedidos").update({ estado }).eq("id", id);
  if (error) throw error;

  const yaEstabaCancelado = pedidoActual?.estado === "cancelado";
  if (estado === "cancelado" && pedidoActual && !yaEstabaCancelado) {
    const items = pedidoActual.items as ItemPedidoGuardado[];
    for (const item of items) {
      if (!item.producto_id) continue;
      await supabase.rpc("incrementar_stock_producto", {
        p_id: item.producto_id,
        p_cantidad: item.cantidad,
      });
    }
  }
}
