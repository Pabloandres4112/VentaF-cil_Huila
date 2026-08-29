"use server";

// Fase 3 (PLAN_EJECUCION.md): Server Actions de productos (CRUD).

import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/types";

export type NuevoProducto = Omit<Producto, "id" | "tienda_id" | "created_at">;

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
  const { data, error } = await supabase
    .from("productos")
    .insert({ ...datos, tienda_id: tiendaId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarProducto(id: string, datos: NuevoProducto): Promise<Producto> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .update(datos)
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
