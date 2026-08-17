"use client";

// Fase 4 (PLAN_EJECUCION.md): edición del perfil de tienda (nombre, WhatsApp).
// Usa localStorage como almacenamiento temporal mientras no existe el
// proyecto de Supabase (Fase 1, en pausa a propósito). Cuando se conecte,
// esto se reemplaza por Server Actions reales en services/store.ts.

import { useCallback, useEffect, useState } from "react";
import { MOCK_TIENDA } from "@/lib/mock-data";
import type { Tienda } from "@/types";

const STORAGE_KEY = "ventafacil_perfil_tienda";

function readTienda(): Tienda {
  if (typeof window === "undefined") return MOCK_TIENDA;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : MOCK_TIENDA;
}

export function useMockTienda() {
  const [tienda, setTienda] = useState<Tienda>(() => readTienda());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tienda));
  }, [tienda]);

  const updateTienda = useCallback((data: Pick<Tienda, "nombre" | "telefono_whatsapp">) => {
    setTienda((prev) => ({ ...prev, ...data }));
  }, []);

  return { tienda, updateTienda };
}
