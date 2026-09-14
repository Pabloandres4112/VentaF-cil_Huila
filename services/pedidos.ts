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

export async function actualizarEstadoPedido(id: string, estado: EstadoPedido): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("pedidos").update({ estado }).eq("id", id);
  if (error) throw error;
}
