"use client";

// Sistema de Licencias (multi-producto): panel de superadministrador.
// No enlazado desde ninguna navegación pública — solo accesible por URL
// directa (/admin/licencias) y protegido por lib/auth/superadmin.ts.

import { useState, useTransition } from "react";
import { CheckIcon, CopyIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { LicenciaForm } from "@/components/licencia-form";
import {
  actualizarEstadoLicencia,
  crearLicencia,
  eliminarLicencia,
  type NuevaLicencia,
} from "@/services/licencias";
import type { EstadoLicenciaAdmin, Licencia } from "@/types";

const ESTADO_STYLES: Record<EstadoLicenciaAdmin, string> = {
  ACTIVA: "bg-wa-tint text-wa-deep",
  DESHABILITADA: "bg-surface-2 text-danger",
};

function formatFecha(fecha: string | null): string {
  if (!fecha) return "Sin vencimiento";
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function LicenciasPanel({ licenciasIniciales }: { licenciasIniciales: Licencia[] }) {
  const [licencias, setLicencias] = useState<Licencia[]>(licenciasIniciales);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleCopy(id: string, licenciaKey: string) {
    await navigator.clipboard.writeText(licenciaKey);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  function handleCrear(values: NuevaLicencia) {
    startTransition(async () => {
      try {
        const nueva = await crearLicencia(values);
        setLicencias((prev) => [nueva, ...prev]);
        setFormOpen(false);
        setError(null);
      } catch {
        setError("No se pudo generar la licencia. Intenta de nuevo.");
      }
    });
  }

  function handleCambiarEstado(id: string, estado: EstadoLicenciaAdmin) {
    const anterior = licencias;
    setLicencias((prev) => prev.map((l) => (l.id === id ? { ...l, estado } : l)));
    startTransition(async () => {
      try {
        await actualizarEstadoLicencia(id, estado);
        setError(null);
      } catch {
        setLicencias(anterior);
        setError("No se pudo actualizar el estado. Intenta de nuevo.");
      }
    });
  }

  function handleEliminar(id: string) {
    const anterior = licencias;
    setLicencias((prev) => prev.filter((l) => l.id !== id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      try {
        await eliminarLicencia(id);
        setError(null);
      } catch {
        setLicencias(anterior);
        setError("No se pudo eliminar la licencia. Intenta de nuevo.");
      }
    });
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

      {error && <p className="text-sm text-danger">{error}</p>}

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
                  <span className="font-display text-sm tabular-nums">{licencia.licencia_key}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(licencia.id, licencia.licencia_key)}
                    aria-label={`Copiar código ${licencia.licencia_key}`}
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
                <p className="text-xs text-ink-faint">
                  Vence: {formatFecha(licencia.fecha_vencimiento)} ·{" "}
                  {licencia.hardware_id ? "Activada en un equipo" : "Sin activar"}
                </p>
              </div>

              <div className="flex flex-none items-center gap-2">
                <select
                  value={licencia.estado}
                  onChange={(e) =>
                    handleCambiarEstado(licencia.id, e.target.value as EstadoLicenciaAdmin)
                  }
                  disabled={isPending}
                  aria-label={`Estado de la licencia de ${licencia.cliente_nombre}`}
                  className={`rounded-md border-0 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide outline-none ${ESTADO_STYLES[licencia.estado]}`}
                >
                  <option value="ACTIVA">Activa</option>
                  <option value="DESHABILITADA">Deshabilitada</option>
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
                      onClick={() => handleEliminar(licencia.id)}
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

      {formOpen && <LicenciaForm onClose={() => setFormOpen(false)} onSubmit={handleCrear} />}
    </div>
  );
}
