"use client";

// Panel de superadministrador (/admin/tiendas): activar/desactivar tiendas y
// cambiar su plan (gratis/pro) — el reemplazo rápido de entrar a Supabase a
// mano cada vez.

import { useState, useTransition } from "react";
import { DateField } from "@/components/date-field";
import { SearchBox } from "@/components/search-box";
import { coincideBusqueda } from "@/lib/utils";
import {
  actualizarEstadoSuscripcionTienda,
  actualizarFechaPagoTienda,
  actualizarPlanTienda,
} from "@/services/admin-tiendas";
import type { EstadoSuscripcion, PlanTienda, Tienda } from "@/types";

// Hoy en "YYYY-MM-DD" (comparación por texto, no por Date — evita líos de
// zona horaria: fecha_pago_hasta es una fecha pura, sin hora).
function hoyISO(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

const ESTADO_STYLES: Record<EstadoSuscripcion, string> = {
  Activo: "bg-wa-tint text-wa-deep",
  Inactivo: "bg-surface-2 text-ink-faint",
};

const PLAN_STYLES: Record<PlanTienda, string> = {
  gratis: "bg-surface-2 text-ink-faint",
  pro: "bg-accent-soft text-accent",
};

export function TiendasPanel({ tiendasIniciales }: { tiendasIniciales: Tienda[] }) {
  const [tiendas, setTiendas] = useState<Tienda[]>(tiendasIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const tiendasFiltradas = tiendas.filter((t) =>
    coincideBusqueda(busqueda, t.nombre, t.store_code, t.telefono_whatsapp),
  );

  function handleCambiarPlan(id: string, plan: PlanTienda) {
    const anterior = tiendas;
    setTiendas((prev) => prev.map((t) => (t.id === id ? { ...t, plan } : t)));
    startTransition(async () => {
      try {
        await actualizarPlanTienda(id, plan);
        setError(null);
      } catch {
        setTiendas(anterior);
        setError("No se pudo cambiar el plan. Intenta de nuevo.");
      }
    });
  }

  function handleCambiarEstado(id: string, estado_suscripcion: EstadoSuscripcion) {
    const anterior = tiendas;
    setTiendas((prev) => prev.map((t) => (t.id === id ? { ...t, estado_suscripcion } : t)));
    startTransition(async () => {
      try {
        await actualizarEstadoSuscripcionTienda(id, estado_suscripcion);
        setError(null);
      } catch {
        setTiendas(anterior);
        setError("No se pudo cambiar el estado. Intenta de nuevo.");
      }
    });
  }

  function handleCambiarFechaPago(id: string, fecha: string) {
    const anterior = tiendas;
    const valor = fecha || null;
    setTiendas((prev) => prev.map((t) => (t.id === id ? { ...t, fecha_pago_hasta: valor } : t)));
    startTransition(async () => {
      try {
        await actualizarFechaPagoTienda(id, valor);
        setError(null);
      } catch {
        setTiendas(anterior);
        setError("No se pudo guardar la fecha de pago. Intenta de nuevo.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-xl">
          Tiendas <span className="text-ink-faint">· {tiendas.length}</span>
        </h1>
        <p className="text-sm text-ink-soft">
          Superadministrador — activa/desactiva tiendas y cambia su plan directamente aquí.
        </p>
      </div>

      {tiendas.length > 0 && (
        <SearchBox
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, código o WhatsApp..."
        />
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {tiendas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong py-12 text-center text-sm text-ink-soft">
          Todavía no hay tiendas registradas.
        </p>
      ) : tiendasFiltradas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong py-12 text-center text-sm text-ink-soft">
          Ninguna tienda coincide con &quot;{busqueda}&quot;.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tiendasFiltradas.map((tienda) => {
            const vencido = Boolean(
              tienda.fecha_pago_hasta && tienda.fecha_pago_hasta < hoyISO(),
            );

            return (
              <div
                key={tienda.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{tienda.nombre}</p>
                    <p className="font-display text-xs text-ink-faint">
                      {tienda.store_code} · {tienda.telefono_whatsapp || "sin WhatsApp"}
                    </p>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <select
                      value={tienda.plan}
                      onChange={(e) => handleCambiarPlan(tienda.id, e.target.value as PlanTienda)}
                      aria-label={`Plan de ${tienda.nombre}`}
                      className={`rounded-md border-0 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide outline-none ${PLAN_STYLES[tienda.plan]}`}
                    >
                      <option value="gratis">Gratis</option>
                      <option value="pro">Pro</option>
                    </select>

                    <select
                      value={tienda.estado_suscripcion}
                      onChange={(e) =>
                        handleCambiarEstado(tienda.id, e.target.value as EstadoSuscripcion)
                      }
                      aria-label={`Estado de ${tienda.nombre}`}
                      className={`rounded-md border-0 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide outline-none ${ESTADO_STYLES[tienda.estado_suscripcion]}`}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t border-line pt-3">
                  <span className="text-xs font-semibold text-ink-soft">Pagado hasta</span>
                  <div className="w-40">
                    <DateField
                      value={tienda.fecha_pago_hasta ?? ""}
                      onChange={(fecha) => handleCambiarFechaPago(tienda.id, fecha)}
                    />
                  </div>
                  {vencido && (
                    <span className="rounded bg-danger/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-danger">
                      Vencido
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
