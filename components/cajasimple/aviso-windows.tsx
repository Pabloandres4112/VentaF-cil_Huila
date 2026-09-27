"use client";

// Aviso amable para quien abre /cajasimple desde un celular o un sistema que
// no es Windows (el enlace suele llegar por WhatsApp). No oculta nada de la
// página: solo avisa y ofrece copiar el enlace para abrirlo en el computador.

import { Check, Copy, Monitor } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

type NavegadorConDatos = Navigator & {
  userAgentData?: { platform?: string; mobile?: boolean };
};

const subscribe = () => () => {};

function esWindowsDeEscritorio(): boolean {
  const datos = (navigator as NavegadorConDatos).userAgentData;
  const ua = navigator.userAgent;
  const movil = datos?.mobile ?? /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const windows = datos?.platform ? /windows/i.test(datos.platform) : /Windows/i.test(ua);
  return windows && !movil;
}

// Copia con la API moderna y, si el navegador no la permite, con el método antiguo.
async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    try {
      const campo = document.createElement("textarea");
      campo.value = texto;
      campo.setAttribute("readonly", "");
      campo.style.position = "fixed";
      campo.style.opacity = "0";
      document.body.appendChild(campo);
      campo.select();
      const copiado = document.execCommand("copy");
      document.body.removeChild(campo);
      return copiado;
    } catch {
      return false;
    }
  }
}

export function AvisoWindows() {
  // En el servidor no se sabe el dispositivo: se asume Windows (sin aviso) y el
  // navegador corrige justo después de hidratar, sin desajuste.
  const esWindows = useSyncExternalStore(subscribe, esWindowsDeEscritorio, () => true);
  const [estado, setEstado] = useState<"inicial" | "copiado" | "error">("inicial");

  if (esWindows) return null;

  async function copiarEnlace() {
    const enlace = `${window.location.origin}${window.location.pathname}`;
    const ok = await copiarTexto(enlace);
    setEstado(ok ? "copiado" : "error");
    window.setTimeout(() => setEstado("inicial"), 2500);
  }

  return (
    <div
      role="note"
      className="mb-6 flex flex-col gap-3 rounded-xl border border-line-strong bg-accent-soft p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <Monitor aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-accent" />
        <p className="text-sm text-ink">
          <strong>CajaSimple se instala en un computador con Windows.</strong> Copia este enlace y
          ábrelo desde tu computador.
        </p>
      </div>
      <button
        type="button"
        onClick={copiarEnlace}
        className="flex flex-none items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
      >
        {estado === "copiado" ? (
          <Check aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Copy aria-hidden="true" className="h-4 w-4" />
        )}
        {estado === "copiado"
          ? "Enlace copiado"
          : estado === "error"
            ? "No se pudo copiar"
            : "Copiar enlace"}
      </button>
      <span aria-live="polite" className="sr-only">
        {estado === "copiado" ? "Enlace copiado" : estado === "error" ? "No se pudo copiar el enlace" : ""}
      </span>
    </div>
  );
}
