import { NextResponse, type NextRequest } from "next/server";
import { firmarLicencia } from "@/lib/licencias/signature";
import { puedeIntentarValidarLicencia, validarLicencia } from "@/services/licencias";

// Sistema de Licencias (multi-producto) — endpoint público consumido por
// CajaSimple (app de escritorio externa, no forma parte de este repo). Ver
// PLAN_EJECUCION.md, anexo "Sistema de Licencias" para el contrato exacto.
//
// No requiere sesión de admin (CajaSimple no puede loguearse en VentaFácil)
// — se protege con un secreto compartido en el header X-Caja-Api-Key en
// vez de con RLS/Supabase Auth.

const API_KEY_HEADER = "x-caja-api-key";

function obtenerIp(request: NextRequest): string {
  // x-forwarded-for puede traer una lista "cliente, proxy1, proxy2" — el
  // primero es el IP real del que hizo la petición.
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "desconocida";
}

export async function POST(request: NextRequest) {
  // Se limita ANTES de revisar la API key a propósito: así también frena a
  // quien intenta adivinar la key misma, no solo a quien ya la tiene y
  // quiere adivinar licencia_key/hardware_id.
  const permitido = await puedeIntentarValidarLicencia(obtenerIp(request));
  if (!permitido) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en un minuto." },
      { status: 429 },
    );
  }

  const apiKey = request.headers.get(API_KEY_HEADER);
  const expectedKey = process.env.CAJASIMPLE_API_KEY;

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const licenciaKey = body?.licencia_key;

  if (!licenciaKey || typeof licenciaKey !== "string") {
    return NextResponse.json({ error: "licencia_key es requerido" }, { status: 400 });
  }

  const hardwareId: string | null =
    typeof body?.hardware_id === "string" ? body.hardware_id : null;

  const resultado = await validarLicencia(licenciaKey, hardwareId);

  const firma_seguridad = firmarLicencia({
    licencia_key: licenciaKey.toUpperCase(),
    estado: resultado.estado,
    fecha_vencimiento: resultado.fecha_vencimiento,
    hardware_id: resultado.hardware_id,
  });

  return NextResponse.json({
    valida: resultado.valida,
    estado: resultado.estado,
    fecha_vencimiento: resultado.fecha_vencimiento,
    firma_seguridad,
  });
}
