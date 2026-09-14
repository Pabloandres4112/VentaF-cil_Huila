"use client";

// Evita que la página de fondo se desplace mientras hay un modal/carrito
// abierto encima (si no, el scroll "se filtra" y se mueven los dos a la vez).

import { useEffect } from "react";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
