"use client";

// Sistema de Licencias (multi-producto): panel de superadministrador.
// No enlazado desde ninguna navegación pública — solo accesible por URL
// directa (/panel/licencias) y protegido por lib/auth/superadmin.ts.

import { useState } from "react";
import { CheckIcon, CopyIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { LicenciaForm } from "@/components/licencia-form";
import { useMockLicencias } from "@/hooks/useMockLicencias";
import type { EstadoLicencia } from "@/types";

const ESTADO_STYLES: Record<EstadoLicencia, string> = {
  Activo: "bg-wa-tint text-wa-deep",
  Inactivo: "bg-surface-2 text-ink-faint",
  Suspendido: "bg-surface-2 text-danger",
};

function formatFecha(fecha: string | null): string {
  if (!fecha) return "Sin vencimiento";
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function LicenciasPanel() {
  const { licencias, crearLicencia, cambiarEstado, eliminarLicencia } = useMockLicencias();
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(id: string, codigo: string) {
    await navigator.clipboard.writeText(codigo);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl">
            Licencias <span className="text-ink-faint">· {licencias.length}</span>
          </h1>
          <p className="text-sm text-ink-soft">Superadministrador — otros sistemas conectados a VentaFácil.</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
        >
          <PlusIcon width={16} height={16} />
          <span className="hidden sm:inline">Generar licencia</span>
          <span className="sm:hidden">Generar</span>
        </button>
      </div>

      {licencias.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong py-12 text-center text-sm text-ink-soft">
          Todavía no has generado ninguna licencia.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {licencias.map((licencia) => (
            <div
              key={licencia.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm tabular-nums">{licencia.codigo}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(licencia.id, licencia.codigo)}
                    aria-label={`Copiar código ${licencia.codigo}`}
                    className="flex h-6 w-6 items-center justify-center rounded text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    {copiedId === licencia.id ? (
                      <CheckIcon width={13} height={13} className="text-wa-deep" />
                    ) : (
                      <CopyIcon width={13} height={13} />
                    )}
                  </button>
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-faint">
                    {licencia.producto}
                  </span>
                </div>
                <p className="text-sm font-medium">{licencia.cliente_nombre}</p>
                <p className="text-xs text-ink-faint">Corte: {formatFecha(licencia.fecha_corte)}</p>
              </div>

              <div className="flex flex-none items-center gap-2">
                <select
                  value={licencia.estado}
                  onChange={(e) => cambiarEstado(licencia.id, e.target.value as EstadoLicencia)}
                  aria-label={`Estado de la licencia de ${licencia.cliente_nombre}`}
                  className={`rounded-md border-0 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide outline-none ${ESTADO_STYLES[licencia.estado]}`}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Suspendido">Suspendido</option>
                </select>

                {confirmDeleteId === licencia.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-md border border-line-strong px-2.5 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:bg-ink/5"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        eliminarLicencia(licencia.id);
                        setConfirmDeleteId(null);
                      }}
                      className="rounded-md bg-danger px-2.5 py-1.5 text-xs font-bold text-danger-ink transition-colors hover:bg-danger/90"
                    >
                      Confirmar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(licencia.id)}
                    aria-label={`Eliminar licencia de ${licencia.cliente_nombre}`}
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-line-strong text-ink-faint transition-colors hover:border-danger hover:text-danger"
                  >
                    <TrashIcon width={14} height={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <LicenciaForm
          onClose={() => setFormOpen(false)}
          onSubmit={(values) => {
            crearLicencia(values);
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
}
