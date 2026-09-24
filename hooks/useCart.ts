"use client";

// Fase 6 (PLAN_EJECUCION.md): carrito local del cliente (sin cuenta, sin backend).

import { useCallback, useEffect, useMemo, useState } from "react";
import { precioEfectivo } from "@/lib/utils";
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

export function useCart(tiendaId: string, catalogo: Producto[]) {
  const storageKey = `${STORAGE_KEY_PREFIX}${tiendaId}`;
  // Arranca vacío a propósito (igual en servidor y en el primer render del
  // cliente) y solo carga el carrito real de localStorage después de montar,
  // en un efecto — leerlo directo en useState causaba un mismatch de
  // hidratación cuando ya había productos guardados de una sesión anterior
  // (mismo motivo por el que theme-toggle.tsx hace lo mismo con el tema).
  const [guardados, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Carga localStorage tras montar a propósito, ver comentario de arriba.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCartFromStorage(storageKey));
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(guardados));
  }, [storageKey, guardados, hydrated]);

  // Lo guardado en localStorage es una foto del producto de cuando se agregó:
  // si después el dueño cambió el precio, puso o quitó una oferta, o bajó el
  // stock, esa foto queda vieja. Por eso lo que se muestra y se cobra sale
  // siempre del catálogo actual; un producto que ya no está o se agotó sale
  // del carrito, y la cantidad nunca pasa del stock vigente.
  const items = useMemo(
    () =>
      guardados.flatMap((item) => {
        const actual = catalogo.find((p) => p.id === item.producto.id);
        if (!actual || actual.stock <= 0) return [];
        return [{ producto: actual, cantidad: Math.min(item.cantidad, actual.stock) }];
      }),
    [guardados, catalogo],
  );

  // El stock es la barrera real en los dos casos: nunca se agrega ni se sube
  // una cantidad por encima de producto.stock, sin importar cuántas veces se
  // haga clic. Evita pedidos que prometan más de lo que la tienda tiene.
  const addItem = useCallback((producto: Producto) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        if (existente.cantidad >= producto.stock) return prev;
        return prev.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        );
      }
      return producto.stock > 0 ? [...prev, { producto, cantidad: 1 }] : prev;
    });
  }, []);

  const removeItem = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }, []);

  const setCantidad = useCallback((productoId: string, cantidad: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.producto.id !== productoId) return [i];
        if (cantidad <= 0) return [];
        return [{ ...i, cantidad: Math.min(cantidad, i.producto.stock) }];
      }),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + precioEfectivo(i.producto) * i.cantidad, 0);
  const cantidadTotal = items.reduce((sum, i) => sum + i.cantidad, 0);

  return { items, addItem, removeItem, setCantidad, clearCart, total, cantidadTotal };
}
