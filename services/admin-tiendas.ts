"use server";

// Panel de superadministrador (/admin/tiendas): reemplaza tener que entrar
// al editor de tablas de Supabase para activar una tienda o cambiarle el
// plan. Usa la service role key porque la RLS de `tiendas` solo permite que
// el dueño edite su propia fila — un superadmin necesita poder tocar
// cualquiera. Cada función revalida isSuperadmin() por su cuenta (no confía
// en que solo se llame desde una página ya protegida).

import { createServiceClient } from "@/lib/supabase/service";
import { isSuperadmin } from "@/lib/auth/superadmin";
import type { EstadoSuscripcion, PlanTienda, Tienda } from "@/types";

export async function listarTiendas(): Promise<Tienda[]> {
  if (!(await isSuperadmin())) throw new Error("No autorizado");

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tiendas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function actualizarPlanTienda(id: string, plan: PlanTienda): Promise<void> {
  if (!(await isSuperadmin())) throw new Error("No autorizado");

  const supabase = createServiceClient();
  const { error } = await supabase.from("tiendas").update({ plan }).eq("id", id);
  if (error) throw error;
}

export async function actualizarEstadoSuscripcionTienda(
  id: string,
  estado: EstadoSuscripcion,
): Promise<void> {
  if (!(await isSuperadmin())) throw new Error("No autorizado");

  const supabase = createServiceClient();
  const { error } = await supabase.from("tiendas").update({ estado_suscripcion: estado }).eq("id", id);
  if (error) throw error;
}
