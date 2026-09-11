"use server";

// Fase 3 (PLAN_EJECUCION.md): Server Actions de la tienda (perfil, WhatsApp, store_code).

import { esUrlImagenValida } from "@/lib/storage-validation";
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
// El teléfono es opcional acá: si el dueño ya lo dio en /registro llega vía
// los metadatos del usuario (ver requireTienda en lib/auth/session.ts); si
// no, queda vacío y lo completa después en /dashboard/perfil.
//
// Justo después de registrarse, el login dispara un router.push("/dashboard")
// seguido de un router.refresh() — en pruebas automatizadas (y a veces en la
// vida real) esos dos renders del dashboard pueden llegar casi al mismo
// tiempo, cada uno viendo "todavía no tiene tienda" antes de que el otro
// termine de insertarla, y los dos intentan crearla. La restricción UNIQUE
// en tiendas.user_id (ver supabase/schema.sql) hace que el segundo intento
// falle con 23505 en vez de duplicar la fila — acá simplemente devolvemos la
// que el primero ya creó.
export async function crearTienda(
  userId: string,
  nombre: string,
  telefonoWhatsapp = "",
): Promise<Tienda> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tiendas")
    .insert({ user_id: userId, nombre, telefono_whatsapp: telefonoWhatsapp })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      const existente = await getTiendaByUserId(userId);
      if (existente) return existente;
    }
    throw error;
  }
  return data;
}

export async function actualizarTienda(
  id: string,
  datos: Pick<
    Tienda,
    | "nombre"
    | "telefono_whatsapp"
    | "color_primario"
    | "color_secundario"
    | "color_fondo"
    | "logo_url"
  >,
): Promise<Tienda> {
  if (datos.logo_url && !esUrlImagenValida(datos.logo_url)) {
    throw new Error("URL de logo inválida");
  }

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
