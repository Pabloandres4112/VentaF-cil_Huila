"use client";

// Fase 4 (PLAN_EJECUCION.md): CRUD de productos del dashboard.
// Usa localStorage como almacenamiento temporal mientras no existe el
// proyecto de Supabase (Fase 1, en pausa a propósito). Cuando se conecte,
// esto se reemplaza por Server Actions reales en services/products.ts.

import { useCallback, useEffect, useState } from "react";
import { MOCK_PRODUCTOS } from "@/lib/mock-data";
import type { Producto } from "@/types";

const STORAGE_KEY_PREFIX = "ventafacil_inventario_";

export type NuevoProducto = Omit<Producto, "id" | "tienda_id" | "created_at">;

function readInventario(storageKey: string): Producto[] {
  if (typeof window === "undefined") return MOCK_PRODUCTOS;
  const raw = window.localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : MOCK_PRODUCTOS;
}

function generarId(): string {
  return `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function useMockInventory(tiendaId: string) {
  const storageKey = `${STORAGE_KEY_PREFIX}${tiendaId}`;
  const [productos, setProductos] = useState<Producto[]>(() => readInventario(storageKey));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(productos));
  }, [storageKey, productos]);

  const addProducto = useCallback(
    (data: NuevoProducto) => {
      const nuevo: Producto = {
        ...data,
        id: generarId(),
        tienda_id: tiendaId,
        created_at: new Date().toISOString(),
      };
      setProductos((prev) => [nuevo, ...prev]);
    },
    [tiendaId],
  );

  const updateProducto = useCallback((id: string, data: NuevoProducto) => {
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deleteProducto = useCallback((id: string) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleDisponible = useCallback((id: string) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, disponible: !p.disponible } : p)),
    );
  }, []);

  return { productos, addProducto, updateProducto, deleteProducto, toggleDisponible };
}
