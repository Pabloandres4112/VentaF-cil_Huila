"use server";

// Sistema de Licencias (multi-producto) — ver PLAN_EJECUCION.md, anexo
// "Sistema de Licencias". No es parte del catálogo/pedidos de Vitrina Digital.
//
// Server Actions del panel /admin/licencias. Usan la service role key
// (lib/supabase/service.ts), que salta RLS, así que TODAS revalidan
// isSuperadmin() por su cuenta: en un archivo "use server" cada función
// exportada se puede invocar desde el navegador, no solo desde la página ya
// protegida. La validación que consume CajaSimple NO vive aquí (ver
// lib/licencias/validacion.ts) justamente para no quedar expuesta así.

import { isSuperadmin } from "@/lib/auth/superadmin";
import { createServiceClient } from "@/lib/supabase/service";
import type { EstadoLicenciaAdmin, Licencia } from "@/types";

export interface NuevaLicencia {
  producto: string;
  cliente_nombre: string;
  fecha_vencimiento: string | null;
}

async function exigirSuperadmin(): Promise<void> {
  if (!(await isSuperadmin())) throw new Error("No autorizado");
}

export async function listarLicencias(): Promise<Licencia[]> {
  await exigirSuperadmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("licencias")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function crearLicencia(datos: NuevaLicencia): Promise<Licencia> {
  await exigirSuperadmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("licencias")
    .insert({
      producto: datos.producto,
      cliente_nombre: datos.cliente_nombre,
      fecha_vencimiento: datos.fecha_vencimiento,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarEstadoLicencia(
  id: string,
  estado: EstadoLicenciaAdmin,
): Promise<void> {
  await exigirSuperadmin();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("licencias")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

// Renovación: mueve la fecha de vencimiento. `fechaISO` es un instante
// completo (el panel manda el final del día elegido).
export async function extenderVencimientoLicencia(id: string, fechaISO: string): Promise<void> {
  await exigirSuperadmin();
  if (Number.isNaN(Date.parse(fechaISO))) throw new Error("Fecha inválida");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("licencias")
    .update({
      fecha_vencimiento: new Date(fechaISO).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

// Para cuando el cliente cambia de PC: limpia el equipo atado, y la próxima
// validación desde el equipo nuevo vuelve a activar la licencia.
export async function liberarEquipoLicencia(id: string): Promise<void> {
  await exigirSuperadmin();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("licencias")
    .update({ hardware_id: null, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function marcarLicenciaRevisada(id: string): Promise<void> {
  await exigirSuperadmin();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("licencias")
    .update({ revision_pendiente: false, revision_motivo: null })
    .eq("id", id);

  if (error) throw error;
}

export async function eliminarLicencia(id: string): Promise<void> {
  await exigirSuperadmin();
  const supabase = createServiceClient();
  const { error } = await supabase.from("licencias").delete().eq("id", id);
  if (error) throw error;
}
