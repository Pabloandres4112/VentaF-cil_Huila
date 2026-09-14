"use server";

// Control de pedidos (dashboard/pedidos.tsx). Antes del checkout el pedido
// solo existía como mensaje de WhatsApp; ahora se guarda una copia acá para
// que el dueño tenga historial. Quien crea un pedido (checkout-modal.tsx) es
// un comprador anónimo sin sesión — por eso crearPedido no exige auth, pero
// listar/actualizar sí quedan detrás de RLS ("solo el dueño ve/cambia sus
// pedidos", ver supabase/schema.sql).

import { createClient } from "@/lib/supabase/server";
import type { EstadoPedido, ItemPedidoGuardado, Pedido } from "@/types";

export interface NuevoPedido {
  referencia: string;
  cliente_nombre: string;
  cliente_direccion: string;
  metodo_pago: string;
  items: ItemPedidoGuardado[];
  total: number;
}

export async function crearPedido(tiendaId: string, datos: NuevoPedido): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("pedidos").insert({ ...datos, tienda_id: tiendaId });
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
