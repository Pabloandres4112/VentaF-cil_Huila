"use client";

// Muestra los Términos y Condiciones en un modal (bottom sheet en mobile,
// panel centrado en desktop) en vez de sacar al usuario del flujo de
// registro hacia /terminos — mismo patrón que ProductForm/CheckoutModal.
//
// El check y el botón "Aceptar" solo se habilitan después de que el usuario
// baja hasta el final del texto — evita que alguien acepte sin siquiera
// haberlo abierto.

import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { TerminosContenido } from "@/components/terminos-contenido";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const UMBRAL_FINAL_PX = 24;

export function TerminosModal({
  onClose,
  onAccept,
}: {
  onClose: () => void;
  onAccept: () => void;
}) {
  useBodyScrollLock(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [leidoCompleto, setLeidoCompleto] = useState(false);
  const [marcado, setMarcado] = useState(false);

  // Si el contenido ya cabe sin necesidad de scroll (pantallas muy altas),
  // no tiene sentido bloquear el check esperando un scroll que nunca va a
  // pasar.
  useEffect(() => {
    const el = contentRef.current;
    if (el && el.scrollHeight <= el.clientHeight + UMBRAL_FINAL_PX) {
      setLeidoCompleto(true);
    }
  }, []);

  function handleScroll() {
    const el = contentRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - UMBRAL_FINAL_PX) {
      setLeidoCompleto(true);
    }
  }

  function handleAceptar() {
    onAccept();
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Términos y Condiciones"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative flex h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-line bg-surface sm:h-[85vh] sm:rounded-2xl">
        <div className="flex flex-none items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg">Términos y Condiciones</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          <TerminosContenido />
        </div>

        <div className="flex flex-none flex-col gap-3 border-t border-line bg-surface px-6 py-4">
          {!leidoCompleto && (
            <p className="text-center text-xs text-ink-faint">
              Desplázate hasta el final para poder aceptar.
            </p>
          )}
          <label
            className={`flex items-start gap-2.5 text-sm text-ink-soft ${
              leidoCompleto ? "" : "cursor-not-allowed opacity-40"
            }`}
          >
            <input
              type="checkbox"
              checked={marcado}
              disabled={!leidoCompleto}
              onChange={(e) => setMarcado(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none accent-accent disabled:cursor-not-allowed"
            />
            He leído y acepto los Términos y Condiciones.
          </label>
          <button
            type="button"
            disabled={!marcado}
            onClick={handleAceptar}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
