"use server";

// Fase 3 (PLAN_EJECUCION.md): Server Actions de la tienda (perfil, WhatsApp, store_code).

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

// Se llama la primera vez que un dueño de negocio entra al dashboard y
// todavía no tiene fila en `tiendas` (alta self-service). store_code lo
// genera la base de datos (DEFAULT en supabase/schema.sql), nunca el cliente.
export async function crearTienda(userId: string, nombre: string): Promise<Tienda> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tiendas")
    .insert({ user_id: userId, nombre, telefono_whatsapp: "" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarTienda(
  id: string,
  datos: Pick<Tienda, "nombre" | "telefono_whatsapp">,
): Promise<Tienda> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tiendas")
    .update(datos)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
