// Lógica de validación de licencias, usada SOLO por el endpoint público
// app/api/v1/licencias/validar/route.ts. Vive fuera de services/licencias.ts a
// propósito: ese archivo es "use server", y todo lo que exporta se puede
// invocar como Server Action desde el navegador — aquí no debe poder.

import { createServiceClient } from "@/lib/supabase/service";
import type { EstadoLicenciaValidacion } from "@/types";

const LICENCIA_VALIDAR_MAX_INTENTOS = 20;
const LICENCIA_VALIDAR_VENTANA_SEGUNDOS = 60;

// Límite de intentos para /api/v1/licencias/validar (ver
// supabase/schema.sql, función registrar_intento) — sin esto, alguien con
// (o incluso sin) la API key de CajaSimple podía intentar adivinar
// licencia_key/hardware_id sin que nada lo frenara. `identificador` es
// normalmente la IP del que llama; 20 intentos/minuto alcanza de sobra para
// el uso real (CajaSimple valida su licencia una vez al iniciar) y hace
// impráctico un ataque de fuerza bruta.
export async function puedeIntentarValidarLicencia(identificador: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("registrar_intento", {
    p_clave: `licencia-validar:${identificador}`,
    p_max_intentos: LICENCIA_VALIDAR_MAX_INTENTOS,
    p_ventana_segundos: LICENCIA_VALIDAR_VENTANA_SEGUNDOS,
  });

  // Si la función de rate limit falla por lo que sea (ej. la migración
  // todavía no se corrió), se prefiere dejar pasar la petición a fallar
  // cerrado y tumbar el endpoint entero para todo el mundo.
  if (error) return true;
  return data === true;
}

export interface ResultadoValidacion {
  valida: boolean;
  estado: EstadoLicenciaValidacion;
  fecha_vencimiento: string | null;
  hardware_id: string | null;
}

// Datos opcionales que CajaSimple manda al activar/validar. No forman parte
// de la firma HMAC ni de la respuesta — solo se guardan para el panel.
export interface DatosActivacion {
  negocio: string | null;
  responsable: string | null;
  telefono: string | null;
  terminos_version: string | null;
  terminos_aceptados_en: string | null;
}

function textoLimpio(valor: unknown, maximo: number): string | null {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim().slice(0, maximo);
  return limpio || null;
}

function fechaISOValida(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const ms = Date.parse(valor);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

// Los campos son opcionales y cualquier cosa rara se ignora en vez de
// rechazar la petición: las versiones ya instaladas de CajaSimple solo
// mandan licencia_key y hardware_id y no pueden romperse.
export function extraerDatosActivacion(body: unknown): DatosActivacion | null {
  if (!body || typeof body !== "object") return null;
  const { cliente, terminos } = body as { cliente?: unknown; terminos?: unknown };
  const c = cliente && typeof cliente === "object" ? (cliente as Record<string, unknown>) : {};
  const t = terminos && typeof terminos === "object" ? (terminos as Record<string, unknown>) : {};

  const datos: DatosActivacion = {
    negocio: textoLimpio(c.negocio, 120),
    responsable: textoLimpio(c.responsable, 120),
    telefono: textoLimpio(c.telefono, 30),
    terminos_version: textoLimpio(t.version, 20),
    terminos_aceptados_en: fechaISOValida(t.aceptados_en),
  };

  return Object.values(datos).some((v) => v !== null) ? datos : null;
}

function normalizarNegocio(texto: string): string {
  return texto.trim().toLowerCase().replace(/\s+/g, " ");
}

function soloDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

export async function validarLicencia(
  licenciaKey: string,
  hardwareId: string | null,
  datos: DatosActivacion | null = null,
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
  // equipos distintos a la vez. Esto sigue BLOQUEANDO a propósito.
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

  if (datos) await guardarDatosActivacion(licencia, datos);

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

// Guarda lo que mandó la app y, si el negocio o el teléfono cambiaron
// respecto a lo que ya estaba guardado, deja la licencia marcada para
// revisión — sin bloquear nada. Va en un try/catch aparte a propósito: es un
// extra para el panel, así que si falla (ej. la migración de columnas aún no
// se corrió) la validación de la licencia no debe romperse.
async function guardarDatosActivacion(
  licencia: Record<string, unknown>,
  datos: DatosActivacion,
): Promise<void> {
  try {
    const motivos: string[] = [];
    const negocioGuardado = licencia.negocio as string | null | undefined;
    const telefonoGuardado = licencia.telefono as string | null | undefined;

    if (
      datos.negocio &&
      negocioGuardado &&
      normalizarNegocio(datos.negocio) !== normalizarNegocio(negocioGuardado)
    ) {
      motivos.push(`negocio "${negocioGuardado}" → "${datos.negocio}"`);
    }
    if (
      datos.telefono &&
      telefonoGuardado &&
      soloDigitos(datos.telefono) !== soloDigitos(telefonoGuardado)
    ) {
      motivos.push(`teléfono "${telefonoGuardado}" → "${datos.telefono}"`);
    }

    const ahora = new Date().toISOString();
    const cambios: Record<string, unknown> = {
      negocio: datos.negocio ?? negocioGuardado ?? null,
      responsable: datos.responsable ?? licencia.responsable ?? null,
      telefono: datos.telefono ?? telefonoGuardado ?? null,
      terminos_version: datos.terminos_version ?? licencia.terminos_version ?? null,
      terminos_aceptados_en: datos.terminos_aceptados_en ?? licencia.terminos_aceptados_en ?? null,
      datos_recibidos_en: ahora,
    };

    if (motivos.length > 0) {
      const previo = licencia.revision_pendiente ? (licencia.revision_motivo as string | null) : null;
      cambios.revision_pendiente = true;
      cambios.revision_motivo = [previo, `${ahora.slice(0, 10)}: ${motivos.join("; ")}`]
        .filter(Boolean)
        .join(" | ")
        .slice(-500);
    }

    const supabase = createServiceClient();
    await supabase.from("licencias").update(cambios).eq("id", licencia.id as string);
  } catch {
    // Silencioso a propósito, ver comentario de arriba.
  }
}
