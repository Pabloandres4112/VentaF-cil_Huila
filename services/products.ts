"use server";

// Fase 3 (PLAN_EJECUCION.md): Server Actions de productos (CRUD).
// Pendiente de implementar junto con la Fase 1 (schema Supabase) y Fase 2 (Auth).

import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/types";

export async function getProductosByTiendaId(tiendaId: string): Promise<Producto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("tienda_id", tiendaId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
