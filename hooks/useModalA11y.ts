"use client";

// Accesibilidad de teclado para diálogos (WCAG 2.1.2 y 2.4.3): Escape cierra,
// el foco entra al diálogo al abrirlo, Tab/Shift+Tab no se escapan hacia la
// página de fondo, y al cerrar el foco vuelve a donde estaba. Si hay varios
// diálogos abiertos a la vez (ej. carrito + checkout), solo responde el que
// quedó arriba.

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLES =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const pila: symbol[] = [];

function enfocables(raiz: HTMLElement): HTMLElement[] {
  return Array.from(raiz.querySelectorAll<HTMLElement>(FOCUSABLES)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

export function useModalA11y(
  ref: RefObject<HTMLElement | null>,
  activo: boolean,
  onClose: () => void,
) {
  const cerrar = useRef(onClose);
  useEffect(() => {
    cerrar.current = onClose;
  });

  useEffect(() => {
    if (!activo) return;
    const raiz = ref.current;
    if (!raiz) return;

    const id = Symbol("modal");
    pila.push(id);
    const previo = document.activeElement as HTMLElement | null;

    const [primero] = enfocables(raiz);
    if (primero) primero.focus();
    else {
      raiz.tabIndex = -1;
      raiz.focus();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (pila[pila.length - 1] !== id || !raiz) return;

      if (e.key === "Escape") {
        e.preventDefault();
        cerrar.current();
        return;
      }

      if (e.key !== "Tab") return;
      const lista = enfocables(raiz);
      if (lista.length === 0) {
        e.preventDefault();
        return;
      }
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      const enDialogo = raiz.contains(document.activeElement);

      if (e.shiftKey && (document.activeElement === primero || !enDialogo)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (document.activeElement === ultimo || !enDialogo)) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const i = pila.indexOf(id);
      if (i !== -1) pila.splice(i, 1);
      previo?.focus?.();
    };
  }, [activo, ref]);
}
