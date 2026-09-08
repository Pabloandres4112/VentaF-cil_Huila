"use client";

// Muestra los Términos y Condiciones en un modal (bottom sheet en mobile,
// panel centrado en desktop) en vez de sacar al usuario del flujo de
// registro hacia /terminos — mismo patrón que ProductForm/CheckoutModal.

import { CloseIcon } from "@/components/icons";
import { TerminosContenido } from "@/components/terminos-contenido";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export function TerminosModal({ onClose }: { onClose: () => void }) {
  useBodyScrollLock(true);

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
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <TerminosContenido />
        </div>
      </div>
    </div>
  );
}
