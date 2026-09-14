"use client";

// Selector de fecha con calendario visual (react-day-picker) en vez del
// <input type="date"> nativo del navegador — se ve distinto en cada
// navegador/SO y en algunos (Brave/Chrome en ciertas configuraciones) el
// formato dd/mm/aaaa queda con una pinta muy cruda. Value/onChange usan
// "YYYY-MM-DD" (string), igual que el input nativo que reemplaza, para no
// tener que tocar quien lo consume (ver licencia-form.tsx).

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import { CalendarIcon, CloseIcon } from "@/components/icons";

function parseFecha(value: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function formatearFecha(date: Date): string {
  return date.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function aValorISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DateField({
  id,
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const seleccionado = parseFecha(value);

  useEffect(() => {
    if (!abierto) return;
    function handleClickFuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [abierto]);

  return (
    <div ref={contenedorRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-line-strong bg-ground px-3.5 py-2.5 text-left text-sm outline-none focus:border-accent"
      >
        <span className={seleccionado ? "text-ink" : "text-ink-faint"}>
          {seleccionado ? formatearFecha(seleccionado) : placeholder}
        </span>
        <span className="flex flex-none items-center gap-1.5 text-ink-faint">
          {seleccionado && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Quitar fecha"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange("");
                }
              }}
              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-ink/5 hover:text-ink"
            >
              <CloseIcon width={11} height={11} />
            </span>
          )}
          <CalendarIcon width={16} height={16} />
        </span>
      </button>

      {abierto && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-line bg-surface p-2 shadow-lg">
          <DayPicker
            mode="single"
            locale={es}
            selected={seleccionado}
            onSelect={(date) => {
              onChange(date ? aValorISO(date) : "");
              setAbierto(false);
            }}
            defaultMonth={seleccionado}
            className="date-field-calendar"
          />
        </div>
      )}
    </div>
  );
}
