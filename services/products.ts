"use server";

// Fase 3 (PLAN_EJECUCION.md): Server Actions de productos (CRUD).

import { LIMITE_PRODUCTOS_GRATIS, MENSAJE_LIMITE_PRODUCTOS_GRATIS } from "@/lib/plan";
import { puedeContinuar } from "@/lib/rate-limit";
import { esUrlImagenValida, extraerPathStorage } from "@/lib/storage-validation";
import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/types";

const BUCKET = "productos";

export type NuevoProducto = Omit<Producto, "id" | "tienda_id" | "created_at">;

function validarImagenUrl(datos: NuevoProducto): NuevoProducto {
  if (datos.imagen_url && !esUrlImagenValida(datos.imagen_url)) {
    throw new Error("URL de imagen inválida");
  }
  if (datos.imagenes_adicionales.some((url) => !esUrlImagenValida(url))) {
    throw new Error("URL de imagen inválida");
  }
  if (
    datos.precio_descuento !== null &&
    (datos.precio_descuento <= 0 || datos.precio_descuento >= datos.precio)
  ) {
    throw new Error("Precio de descuento inválido");
  }
  return datos;
}

// Compara las fotos de la versión anterior contra la nueva y borra de
// Storage las que ya no se usan (portada + adicionales) — evita que se
// acumulen archivos huérfanos cada vez que se reemplaza o se quita una foto.
async function borrarFotosHuerfanas(
  supabase: Awaited<ReturnType<typeof createClient>>,
  anteriores: (string | null)[],
  nuevas: (string | null)[],
): Promise<void> {
  const paths = anteriores
    .filter((url): url is string => Boolean(url) && !nuevas.includes(url))
    .map(extraerPathStorage)
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) await supabase.storage.from(BUCKET).remove(paths);
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
    .select("imagen_url, imagenes_adicionales")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("productos")
    .update(validarImagenUrl(datos))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (anterior) {
    await borrarFotosHuerfanas(
      supabase,
      [anterior.imagen_url, ...(anterior.imagenes_adicionales ?? [])],
      [datos.imagen_url, ...datos.imagenes_adicionales],
    );
  }

  return data;
}

export async function eliminarProducto(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: producto } = await supabase
    .from("productos")
    .select("imagen_url, imagenes_adicionales")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw error;

  if (producto) {
    await borrarFotosHuerfanas(
      supabase,
      [producto.imagen_url, ...(producto.imagenes_adicionales ?? [])],
      [],
    );
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
  // Máx. 10 checkouts cada 10 minutos por IP: de sobra para un comprador real
  // y suficiente para frenar a quien quiera vaciar el stock de una tienda.
  if (!(await puedeContinuar("checkout", 10, 600))) {
    throw new Error("Demasiados intentos");
  }
  if (
    items.length === 0 ||
    items.length > 50 ||
    items.some((i) => !Number.isInteger(i.cantidad) || i.cantidad < 1 || i.cantidad > 999)
  ) {
    throw new Error("Pedido inválido");
  }

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
