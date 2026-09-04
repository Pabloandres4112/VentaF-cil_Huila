"use client";

// Fase 4 (PLAN_EJECUCION.md): editar nombre de tienda y WhatsApp.
// El store_code es inmutable (no se edita, ver PLAN_EJECUCION.md sección 5).

import { useState, useTransition, type FormEvent } from "react";
import { CheckIcon, ColombiaFlagIcon, CopyIcon } from "@/components/icons";
import { actualizarTienda } from "@/services/store";
import type { Tienda } from "@/types";

const INPUT_CLASS =
  "rounded-md border bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

const INDICATIVO_COLOMBIA = "57";

interface PerfilErrors {
  nombre?: string;
  telefono?: string;
  general?: string;
}

// El único mercado hoy es Colombia, así que el indicativo +57 es fijo (no un
// select) y el dueño solo escribe su número local de 10 dígitos — evita que
// alguien guarde un número sin indicativo y el link de wa.me quede roto.
function extraerNumeroLocal(telefonoCompleto: string): string {
  if (telefonoCompleto.startsWith(INDICATIVO_COLOMBIA) && telefonoCompleto.length === 12) {
    return telefonoCompleto.slice(2);
  }
  return telefonoCompleto.replace(/\D/g, "").slice(0, 10);
}

export function DashboardProfile({ tienda: tiendaInicial }: { tienda: Tienda }) {
  const [tienda, setTienda] = useState(tiendaInicial);
  const [nombre, setNombre] = useState(tiendaInicial.nombre);
  const [telefonoLocal, setTelefonoLocal] = useState(
    extraerNumeroLocal(tiendaInicial.telefono_whatsapp),
  );
  const [colorPrimario, setColorPrimario] = useState(tiendaInicial.color_primario ?? "#24405e");
  const [colorSecundario, setColorSecundario] = useState(
    tiendaInicial.color_secundario ?? "#58626f",
  );
  const [errors, setErrors] = useState<PerfilErrors>({});
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const storeUrl = `/store/${tienda.store_code}`;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: PerfilErrors = {};
    if (nombre.trim().length < 2) nextErrors.nombre = "Ingresa un nombre (mínimo 2 caracteres).";
    if (!/^\d{10}$/.test(telefonoLocal)) {
      nextErrors.telefono = "Ingresa los 10 dígitos de tu número, sin el indicativo.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const datos = {
      nombre: nombre.trim(),
      telefono_whatsapp: INDICATIVO_COLOMBIA + telefonoLocal,
      color_primario: colorPrimario,
      color_secundario: colorSecundario,
    };
    startTransition(async () => {
      try {
        const actualizada = await actualizarTienda(tienda.id, datos);
        setTienda(actualizada);
        setErrors({});
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1600);
      } catch {
        setErrors({ general: "No se pudo guardar. Intenta de nuevo." });
      }
    });
  }

  async function handleCopy() {
    const fullUrl = `${window.location.origin}${storeUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div className="rounded-xl border border-line bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
            Código de tienda
          </p>
          <span
            className={`rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${
              tienda.estado_suscripcion === "Activo"
                ? "bg-wa-tint text-wa-deep"
                : "bg-surface-2 text-ink-faint"
            }`}
          >
            {tienda.estado_suscripcion}
          </span>
        </div>
        <p className="font-display mb-1 text-lg">{tienda.store_code}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm text-ink-soft">ventafacil.com{storeUrl}</p>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copiar link del catálogo"
            className="flex flex-none items-center gap-1.5 rounded-md border border-line-strong px-2.5 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:bg-ink/5"
          >
            {copied ? (
              <CheckIcon width={14} height={14} className="text-wa-deep" />
            ) : (
              <CopyIcon width={14} height={14} />
            )}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          Este código es fijo y no se puede cambiar — identifica tu tienda de forma única.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="perfil-nombre" className="text-sm font-semibold text-ink-soft">
            Nombre de la tienda
          </label>
          <input
            id="perfil-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            aria-invalid={Boolean(errors.nombre)}
            className={`${INPUT_CLASS} ${errors.nombre ? "border-danger" : "border-line-strong"}`}
          />
          {errors.nombre && <p className="text-xs text-danger">{errors.nombre}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="perfil-whatsapp" className="text-sm font-semibold text-ink-soft">
            Número de WhatsApp
          </label>
          <div className="flex gap-2">
            <span className="flex flex-none items-center gap-1.5 rounded-md border border-line-strong bg-surface-2 px-3 text-sm font-bold text-ink-soft">
              <ColombiaFlagIcon />+{INDICATIVO_COLOMBIA}
            </span>
            <input
              id="perfil-whatsapp"
              inputMode="numeric"
              value={telefonoLocal}
              onChange={(e) => setTelefonoLocal(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="3001234567"
              aria-invalid={Boolean(errors.telefono)}
              className={`${INPUT_CLASS} flex-1 ${errors.telefono ? "border-danger" : "border-line-strong"}`}
            />
          </div>
          {errors.telefono ? (
            <p className="text-xs text-danger">{errors.telefono}</p>
          ) : (
            <p className="text-xs text-ink-faint">Solo tu número, sin indicativo. Ej: 3001234567.</p>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <div>
            <p className="text-sm font-semibold text-ink-soft">Colores de tu tienda</p>
            <p className="text-xs text-ink-faint">
              Se aplican en tu catálogo público — el nombre y estos dos colores son lo único que
              puedes personalizar.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-line bg-ground p-4">
            <div className="flex flex-1 gap-4">
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-soft">Primario (botones)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label="Color primario"
                    value={colorPrimario}
                    onChange={(e) => setColorPrimario(e.target.value)}
                    className="h-9 w-9 flex-none cursor-pointer rounded-full border-2 border-surface p-0 shadow-[0_0_0_1px_var(--line-strong)]"
                  />
                  <span className="font-display text-xs uppercase tabular-nums text-ink-faint">
                    {colorPrimario}
                  </span>
                </div>
              </label>
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-soft">Secundario (identidad)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label="Color secundario"
                    value={colorSecundario}
                    onChange={(e) => setColorSecundario(e.target.value)}
                    className="h-9 w-9 flex-none cursor-pointer rounded-full border-2 border-surface p-0 shadow-[0_0_0_1px_var(--line-strong)]"
                  />
                  <span className="font-display text-xs uppercase tabular-nums text-ink-faint">
                    {colorSecundario}
                  </span>
                </div>
              </label>
            </div>

            <div className="flex flex-none flex-col items-center gap-1.5 border-l border-line pl-4">
              <span className="text-[0.65rem] font-bold uppercase tracking-wide text-ink-faint">
                Vista previa
              </span>
              <div className="flex items-center gap-2 rounded-full border border-line bg-surface p-1.5 pr-3">
                <span
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-full font-display text-xs text-white"
                  style={{ backgroundColor: colorSecundario }}
                >
                  {(nombre.trim().charAt(0) || "T").toUpperCase()}
                </span>
                <span
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-sm font-bold text-white"
                  style={{ backgroundColor: colorPrimario }}
                >
                  +
                </span>
              </div>
            </div>
          </div>
        </div>

        {errors.general && <p className="text-xs text-danger">{errors.general}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 disabled:opacity-60"
        >
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
