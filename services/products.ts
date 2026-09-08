"use server";

// Fase 3 (PLAN_EJECUCION.md): Server Actions de productos (CRUD).

import { LIMITE_PRODUCTOS_GRATIS, MENSAJE_LIMITE_PRODUCTOS_GRATIS } from "@/lib/plan";
import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/types";

export type NuevoProducto = Omit<Producto, "id" | "tienda_id" | "created_at">;

// Defensa en profundidad: aunque el formulario solo permite subir una imagen
// real a Storage (image-upload.tsx), esto bloquea que alguien llame al
// Server Action directamente con una URL externa, un `javascript:` o
// cualquier otra cosa que no sea una foto de nuestro propio bucket.
function esUrlImagenValida(url: string): boolean {
  const prefijo = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/`;
  return url.startsWith(prefijo);
}

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

export async function actualizarProducto(id: string, datos: NuevoProducto): Promise<Producto> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .update(validarImagenUrl(datos))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function eliminarProducto(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw error;
}

export async function alternarDisponibleProducto(
  id: string,
  disponible: boolean,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("productos").update({ disponible }).eq("id", id);
  if (error) throw error;
}
