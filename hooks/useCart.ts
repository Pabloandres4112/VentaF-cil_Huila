"use client";

// Fase 6 (PLAN_EJECUCION.md): carrito local del cliente (sin cuenta, sin backend).

import { useCallback, useEffect, useState } from "react";
import type { Producto } from "@/types";

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

const STORAGE_KEY_PREFIX = "ventafacil_cart_";

function readCartFromStorage(storageKey: string): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
}

export function useCart(tiendaId: string) {
  const storageKey = `${STORAGE_KEY_PREFIX}${tiendaId}`;
  const [items, setItems] = useState<CartItem[]>(() => readCartFromStorage(storageKey));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [storageKey, items]);

  const addItem = useCallback((producto: Producto) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  }, []);

  const removeItem = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }, []);

  const setCantidad = useCallback((productoId: string, cantidad: number) => {
    setItems((prev) =>
      cantidad <= 0
        ? prev.filter((i) => i.producto.id !== productoId)
        : prev.map((i) => (i.producto.id === productoId ? { ...i, cantidad } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((sum, i) => sum + i.cantidad, 0);

  return { items, addItem, removeItem, setCantidad, clearCart, total, cantidadTotal };
}
