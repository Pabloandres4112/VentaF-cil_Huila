"use client";

// Elegir el vencimiento de una licencia con atajos (prueba de 1 mes, 1 mes,
// 6 meses, 1 año) contados desde una fecha de partida, o una fecha exacta en
// el calendario. Lo usan tanto "Generar licencia" como "Extender vencimiento".

import { useState } from "react";
import { DateField } from "@/components/date-field";
import { aFechaISO, sumarMeses } from "@/lib/utils";

interface Atajo {
  clave: string;
  label: string;
  meses: number | null;
}

const ATAJOS: Atajo[] = [
  { clave: "1m", label: "1 mes", meses: 1 },
  { clave: "6m", label: "6 meses", meses: 6 },
  { clave: "1a", label: "1 año", meses: 12 },
];

const ATAJO_SIN_VENCIMIENTO: Atajo = { clave: "sin", label: "Sin vencimiento", meses: null };

const FORMATO_LARGO = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function valorDeAtajo(atajo: Atajo, desde: Date): string {
  return atajo.meses === null ? "" : aFechaISO(sumarMeses(desde, atajo.meses));
}

// Valor inicial para quien quiera arrancar con la prueba de 1 mes ya elegida.
export function vencimientoPrueba(desde: Date = new Date()): string {
  return aFechaISO(sumarMeses(desde, 1));
}

export function DuracionLicencia({
  id,
  value,
  onChange,
  desde,
  etiquetaDesde = "Desde hoy",
  atajoInicial = null,
  esPrueba = false,
  permitirSinVencimiento = false,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  desde: Date;
  etiquetaDesde?: string;
  atajoInicial?: string | null;
  // En una licencia nueva el primer mes es la prueba; al renovar es solo "1 mes".
  esPrueba?: boolean;
  permitirSinVencimiento?: boolean;
}) {
  const [atajoElegido, setAtajoElegido] = useState<string | null>(atajoInicial);
  const base = esPrueba
    ? ATAJOS.map((a) => (a.clave === "1m" ? { ...a, label: "Prueba · 1 mes" } : a))
    : ATAJOS;
  const atajos = permitirSinVencimiento ? [...base, ATAJO_SIN_VENCIMIENTO] : base;

  function elegir(atajo: Atajo) {
    setAtajoElegido(atajo.clave);
    onChange(valorDeAtajo(atajo, desde));
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-ink-faint">
        {etiquetaDesde}:{" "}
        <span className="font-semibold text-ink-soft">{FORMATO_LARGO.format(desde)}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {atajos.map((atajo) => {
          const activo = atajoElegido === atajo.clave && value === valorDeAtajo(atajo, desde);
          return (
            <button
              key={atajo.clave}
              type="button"
              onClick={() => elegir(atajo)}
              aria-pressed={activo}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                activo
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line-strong text-ink-soft hover:bg-ink/5"
              }`}
            >
              {atajo.label}
            </button>
          );
        })}
      </div>
      <DateField
        id={id}
        value={value}
        onChange={(nuevo) => {
          setAtajoElegido(null);
          onChange(nuevo);
        }}
        placeholder={
          permitirSinVencimiento ? "Sin vencimiento — o elige una fecha" : "Elige una fecha"
        }
      />
    </div>
  );
}
