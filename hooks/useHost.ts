"use client";

// Host real desde el que se está viendo la app (ej. vitrina-digital-prod.vercel.app
// o localhost:3000), para mostrar el link verdadero de la tienda en vez de un
// dominio escrito a mano. En el servidor devuelve "" y el cliente lo completa
// tras hidratar, sin desajuste.

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useHost(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.host,
    () => "",
  );
}
