// Límite de intentos por IP para acciones públicas del servidor (checkout,
// crear pedido). Reutiliza la función registrar_intento de Postgres (ver
// supabase/schema.sql), la misma del endpoint de licencias — un contador de
// ventana fija por clave. Sin esto cualquiera podía llenar de pedidos falsos
// una tienda y de paso vaciarle el stock, porque el pedido descuenta stock.

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

async function obtenerIpCliente(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "desconocida";
}

export async function puedeContinuar(
  prefijo: string,
  maxIntentos: number,
  ventanaSegundos: number,
): Promise<boolean> {
  const ip = await obtenerIpCliente();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("registrar_intento", {
    p_clave: `${prefijo}:${ip}`,
    p_max_intentos: maxIntentos,
    p_ventana_segundos: ventanaSegundos,
  });

  // Si el contador falla (ej. la migración no se corrió) se deja pasar: un
  // fallo del limitador no debe tumbar las compras reales.
  if (error) return true;
  return data === true;
}
