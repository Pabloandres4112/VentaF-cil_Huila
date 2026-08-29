"use client";

// Sistema de Licencias (multi-producto) — panel de superadministrador para
// administrar licencias de otros sistemas (ej. inventario local) desde la
// misma app/base de datos de VentaFácil. Usa localStorage como
// almacenamiento temporal mientras no existe el proyecto de Supabase (Fase
// 1, en pausa a propósito). Cuando se conecte, esto se reemplaza por
// Server Actions reales contra la tabla `licencias` (ver supabase/schema.sql).

import { useCallback, useEffect, useState } from "react";
import { MOCK_LICENCIAS } from "@/lib/mock-data";
import type { EstadoLicencia, Licencia } from "@/types";

const STORAGE_KEY = "ventafacil_licencias";
const CODIGO_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I para evitar confusión al leerlo

export interface NuevaLicencia {
  producto: string;
  cliente_nombre: string;
  fecha_corte: string | null;
}

function generarCodigo(): string {
  const sufijo = Array.from(
    { length: 6 },
    () => CODIGO_CHARS[Math.floor(Math.random() * CODIGO_CHARS.length)],
  ).join("");
  return `INV-${sufijo}`;
}

function readLicencias(): Licencia[] {
  if (typeof window === "undefined") return MOCK_LICENCIAS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : MOCK_LICENCIAS;
}

export function useMockLicencias() {
  const [licencias, setLicencias] = useState<Licencia[]>(() => readLicencias());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(licencias));
  }, [licencias]);

  const crearLicencia = useCallback((data: NuevaLicencia) => {
    const nueva: Licencia = {
      id: `lic_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      codigo: generarCodigo(),
      producto: data.producto,
      cliente_nombre: data.cliente_nombre,
      tienda_id: null,
      estado: "Activo",
      fecha_corte: data.fecha_corte,
      created_at: new Date().toISOString(),
    };
    setLicencias((prev) => [nueva, ...prev]);
  }, []);

  const cambiarEstado = useCallback((id: string, estado: EstadoLicencia) => {
    setLicencias((prev) => prev.map((l) => (l.id === id ? { ...l, estado } : l)));
  }, []);

  const eliminarLicencia = useCallback((id: string) => {
    setLicencias((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { licencias, crearLicencia, cambiarEstado, eliminarLicencia };
}
