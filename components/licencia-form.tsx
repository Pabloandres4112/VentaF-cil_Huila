"use client";

// Sistema de Licencias (multi-producto): formulario para generar una nueva licencia.

import { useState, type FormEvent } from "react";
import { CloseIcon } from "@/components/icons";
import type { NuevaLicencia } from "@/services/licencias";

const INPUT_CLASS =
  "rounded-md border bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

interface LicenciaFormErrors {
  cliente_nombre?: string;
}

export function LicenciaForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (values: NuevaLicencia) => void;
}) {
  const [producto, setProducto] = useState("cajasimple");
  const [clienteNombre, setClienteNombre] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [errors, setErrors] = useState<LicenciaFormErrors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: LicenciaFormErrors = {};
    if (clienteNombre.trim().length < 2) {
      nextErrors.cliente_nombre = "Ingresa el nombre del cliente (mínimo 2 caracteres).";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // El input solo da la fecha (YYYY-MM-DD); la licencia vence al final de ese día.
    const fechaVencimientoISO = fechaVencimiento
      ? new Date(`${fechaVencimiento}T23:59:59`).toISOString()
      : null;

    onSubmit({
      producto: producto.trim() || "cajasimple",
      cliente_nombre: clienteNombre.trim(),
      fecha_vencimiento: fechaVencimientoISO,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Generar licencia"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative w-full max-w-md rounded-t-2xl border border-line bg-surface p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg">Generar licencia</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lic-producto" className="text-sm font-semibold text-ink-soft">
              Producto/Sistema
            </label>
            <input
              id="lic-producto"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              placeholder="cajasimple"
              className={`${INPUT_CLASS} border-line-strong`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lic-cliente" className="text-sm font-semibold text-ink-soft">
              Cliente
            </label>
            <input
              id="lic-cliente"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder="Nombre de la empresa o persona"
              aria-invalid={Boolean(errors.cliente_nombre)}
              className={`${INPUT_CLASS} ${errors.cliente_nombre ? "border-danger" : "border-line-strong"}`}
            />
            {errors.cliente_nombre && (
              <p className="text-xs text-danger">{errors.cliente_nombre}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lic-vencimiento" className="text-sm font-semibold text-ink-soft">
              Fecha de vencimiento
            </label>
            <input
              id="lic-vencimiento"
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className={`${INPUT_CLASS} border-line-strong`}
            />
            <p className="text-xs text-ink-faint">Opcional — déjalo vacío si no tiene vencimiento.</p>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-line-strong px-4 py-3 text-sm font-bold text-ink-soft transition-colors hover:bg-ink/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
            >
              Generar código
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
