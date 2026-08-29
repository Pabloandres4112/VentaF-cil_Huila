// Sistema de Licencias (multi-producto): firma de la respuesta del
// endpoint de validación, para que CajaSimple pueda verificar que la
// respuesta viene realmente de VentaFácil y no fue alterada (incluso si
// CajaSimple la cachea localmente para uso offline).
//
// Esquema: HMAC-SHA256, hex, sobre los campos de la respuesta unidos con
// "|" en este orden exacto:
//
//   licencia_key|estado|fecha_vencimiento|hardware_id
//
// - fecha_vencimiento: el string ISO exacto devuelto, o "" si es null.
// - hardware_id: el valor exacto devuelto, o "" si es null.
//
// CajaSimple debe recalcular el mismo HMAC con el mismo secreto
// (LICENSE_SIGNING_SECRET, compartido por fuera del código) sobre los
// campos que recibió, y comparar contra "firma_seguridad". Si no
// coinciden, debe tratar la respuesta como no confiable.
//
// Ejemplo equivalente en Node (referencia para portar a Rust/JS en
// CajaSimple):
//   const crypto = require("node:crypto");
//   const payload = `${licencia_key}|${estado}|${fecha_vencimiento ?? ""}|${hardware_id ?? ""}`;
//   const firma = crypto.createHmac("sha256", secret).update(payload).digest("hex");

import { createHmac } from "node:crypto";

export interface FirmaPayload {
  licencia_key: string;
  estado: string;
  fecha_vencimiento: string | null;
  hardware_id: string | null;
}

export function buildFirmaPayload(payload: FirmaPayload): string {
  const { licencia_key, estado, fecha_vencimiento, hardware_id } = payload;
  return `${licencia_key}|${estado}|${fecha_vencimiento ?? ""}|${hardware_id ?? ""}`;
}

export function firmarLicencia(payload: FirmaPayload): string {
  const secret = process.env.LICENSE_SIGNING_SECRET;
  if (!secret) {
    throw new Error("LICENSE_SIGNING_SECRET no está configurado.");
  }
  return createHmac("sha256", secret).update(buildFirmaPayload(payload)).digest("hex");
}
