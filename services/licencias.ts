"use server";

// Sistema de Licencias (multi-producto) — ver PLAN_EJECUCION.md, anexo
// "Sistema de Licencias". No es parte del catálogo/pedidos de VentaFácil.
//
// Usa la service role key (lib/supabase/service.ts), no la de sesión de
// usuario: ni el panel /admin/licencias ni el endpoint de validación
// externo tienen todavía una sesión real de Supabase Auth detrás (Fase 2
// en pausa). RLS en la tabla `licencias` bloquea todo lo demás.

import { createServiceClient } from "@/lib/supabase/service";
import type { EstadoLicenciaAdmin, EstadoLicenciaValidacion, Licencia } from "@/types";

export interface NuevaLicencia {
  producto: string;
  cliente_nombre: string;
  fecha_vencimiento: string | null;
}

export async function listarLicencias(): Promise<Licencia[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("licencias")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function crearLicencia(datos: NuevaLicencia): Promise<Licencia> {
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
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("licencias")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function eliminarLicencia(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("licencias").delete().eq("id", id);
  if (error) throw error;
}

// --- Validación (usada por app/api/v1/licencias/validar/route.ts) ---

export interface ResultadoValidacion {
  valida: boolean;
  estado: EstadoLicenciaValidacion;
  fecha_vencimiento: string | null;
  hardware_id: string | null;
}

export async function validarLicencia(
  licenciaKey: string,
  hardwareId: string | null,
): Promise<ResultadoValidacion> {
  const supabase = createServiceClient();
  const { data: licencia, error } = await supabase
    .from("licencias")
    .select("*")
    .eq("licencia_key", licenciaKey.toUpperCase())
    .maybeSingle();

  if (error) throw error;

  if (!licencia) {
    return { valida: false, estado: "INVALIDA", fecha_vencimiento: null, hardware_id: null };
  }

  // Vinculación de hardware: si la licencia no tiene hardware_id todavía,
  // esta primera validación exitosa la activa (primer uso = activación).
  // Si ya tiene uno, debe coincidir — así una misma clave no sirve en dos
  // equipos distintos a la vez.
  let hardwareIdFinal: string | null = licencia.hardware_id;

  if (hardwareId) {
    if (!licencia.hardware_id) {
      const { error: updateError } = await supabase
        .from("licencias")
        .update({ hardware_id: hardwareId, updated_at: new Date().toISOString() })
        .eq("id", licencia.id);
      if (updateError) throw updateError;
      hardwareIdFinal = hardwareId;
    } else if (licencia.hardware_id !== hardwareId) {
      return {
        valida: false,
        estado: "HARDWARE_NO_COINCIDE",
        fecha_vencimiento: licencia.fecha_vencimiento,
        hardware_id: licencia.hardware_id,
      };
    }
  }

  const vencida =
    licencia.fecha_vencimiento !== null && new Date(licencia.fecha_vencimiento) < new Date();

  if (vencida) {
    return {
      valida: false,
      estado: "VENCIDA",
      fecha_vencimiento: licencia.fecha_vencimiento,
      hardware_id: hardwareIdFinal,
    };
  }

  return {
    valida: licencia.estado === "ACTIVA",
    estado: licencia.estado,
    fecha_vencimiento: licencia.fecha_vencimiento,
    hardware_id: hardwareIdFinal,
  };
}
