"use server";

// Fase 3 (PLAN_EJECUCION.md): Server Actions de la tienda (perfil, WhatsApp, store_code).
// Pendiente de implementar junto con la Fase 1 (schema Supabase) y Fase 2 (Auth).

import { createClient } from "@/lib/supabase/server";
import type { Tienda } from "@/types";

export async function getTiendaByUserId(userId: string): Promise<Tienda | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tiendas")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data;
}

export async function getTiendaByCode(storeCode: string): Promise<Tienda | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tiendas")
    .select("*")
    .eq("store_code", storeCode.toUpperCase())
    .maybeSingle();

  return data;
}
