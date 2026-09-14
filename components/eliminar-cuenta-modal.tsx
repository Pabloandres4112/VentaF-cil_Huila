"use client";

// Confirmación para borrar la cuenta (ver services/account.ts) — pedir que
// escriba el código de la tienda, no solo un click, porque esto es
// irreversible: borra el usuario de Auth, la tienda, sus productos y sus
// fotos/logo en Storage.

import { useState, type FormEvent } from "react";
import { CloseIcon } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export function EliminarCuentaModal({
  storeCode,
  onClose,
  onConfirmar,
}: {
  storeCode: string;
  onClose: () => void;
  onConfirmar: () => Promise<void>;
}) {
  useBodyScrollLock(true);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmado = texto.trim().toUpperCase() === storeCode.toUpperCase();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirmado || loading) return;

    setLoading(true);
    setError(null);
    try {
      await onConfirmar();
    } catch {
      setError("No se pudo eliminar la cuenta. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Eliminar cuenta"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        disabled={loading}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative w-full max-w-md rounded-t-2xl border border-line bg-surface p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-danger">Eliminar cuenta</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <p className="mb-4 text-sm text-ink-soft">
          Esto borra tu tienda, todos tus productos, tus fotos y tu logo — para siempre. No se
          puede deshacer.
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          <label htmlFor="confirmar-borrado" className="text-sm font-semibold text-ink-soft">
            Escribe <span className="font-display text-ink">{storeCode}</span> para confirmar
          </label>
          <input
            id="confirmar-borrado"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={storeCode}
            autoComplete="off"
            className="rounded-md border border-line-strong bg-ground px-3.5 py-2.5 font-display text-sm uppercase tracking-wide text-ink outline-none focus:border-danger"
          />

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-md border border-line-strong px-4 py-3 text-sm font-bold text-ink-soft transition-colors hover:bg-ink/5 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!confirmado || loading}
              className="flex-1 rounded-md bg-danger px-4 py-3 text-sm font-bold text-danger-ink transition-colors hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Eliminando..." : "Eliminar cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
