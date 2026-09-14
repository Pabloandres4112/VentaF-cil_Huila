"use server";

// Fase 3 (PLAN_EJECUCION.md): Server Actions de productos (CRUD).

import { LIMITE_PRODUCTOS_GRATIS, MENSAJE_LIMITE_PRODUCTOS_GRATIS } from "@/lib/plan";
import { esUrlImagenValida, extraerPathStorage } from "@/lib/storage-validation";
import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/types";

const BUCKET = "productos";

export type NuevoProducto = Omit<Producto, "id" | "tienda_id" | "created_at">;

function validarImagenUrl(datos: NuevoProducto): NuevoProducto {
  if (datos.imagen_url && !esUrlImagenValida(datos.imagen_url)) {
    throw new Error("URL de imagen inválida");
  }
  return datos;
}

export async function getProductosByTiendaId(tiendaId: string): Promise<Producto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("tienda_id", tiendaId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function crearProducto(tiendaId: string, datos: NuevoProducto): Promise<Producto> {
  const supabase = await createClient();

  const { data: tienda } = await supabase
    .from("tiendas")
    .select("plan")
    .eq("id", tiendaId)
    .single();

  if (tienda?.plan !== "pro") {
    const { count } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true })
      .eq("tienda_id", tiendaId);

    if ((count ?? 0) >= LIMITE_PRODUCTOS_GRATIS) {
      throw new Error(MENSAJE_LIMITE_PRODUCTOS_GRATIS);
    }
  }

  const { data, error } = await supabase
    .from("productos")
    .insert({ ...validarImagenUrl(datos), tienda_id: tiendaId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Si la foto cambia (o se quita), la anterior queda huérfana en Storage
// para siempre si nadie la borra — acá se borra la vieja después de guardar
// la nueva, solo cuando de verdad cambió.
export async function actualizarProducto(id: string, datos: NuevoProducto): Promise<Producto> {
  const supabase = await createClient();

  const { data: anterior } = await supabase
    .from("productos")
    .select("imagen_url")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("productos")
    .update(validarImagenUrl(datos))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (anterior?.imagen_url && anterior.imagen_url !== datos.imagen_url) {
    const path = extraerPathStorage(anterior.imagen_url);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  }

  return data;
}

export async function eliminarProducto(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: producto } = await supabase
    .from("productos")
    .select("imagen_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw error;

  if (producto?.imagen_url) {
    const path = extraerPathStorage(producto.imagen_url);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  }
}

export async function alternarDisponibleProducto(
  id: string,
  disponible: boolean,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("productos").update({ disponible }).eq("id", id);
  if (error) throw error;
}

// Se llama al enviar el pedido por WhatsApp (checkout-modal.tsx) — es lo más
// cercano a "se vendió" que la app puede detectar, ya que el pedido nunca
// toca el servidor después de eso. La función de Postgres es SECURITY
// DEFINER porque quien hace checkout no tiene sesión (RLS normalmente solo
// deja modificar productos al dueño de la tienda), y descuenta de forma
// atómica (WHERE stock >= cantidad) para que dos pedidos casi simultáneos no
// puedan vender la misma última unidad dos veces.
export interface ItemPedidoStock {
  productoId: string;
  cantidad: number;
}

export async function descontarStockPedido(
  items: ItemPedidoStock[],
): Promise<{ ok: boolean; agotados: string[] }> {
  const supabase = await createClient();
  const agotados: string[] = [];

  for (const item of items) {
    const { data, error } = await supabase.rpc("descontar_stock_producto", {
      p_id: item.productoId,
      p_cantidad: item.cantidad,
    });
    if (error) throw error;
    if (!data || data.length === 0) agotados.push(item.productoId);
  }

  return { ok: agotados.length === 0, agotados };
}
