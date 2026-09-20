"use client";

// Aviso de vencimiento del plan Pro — chico y se puede cerrar (no un banner
// invasivo arriba de toda la página). Vive en /dashboard, justo debajo de
// la tarjeta del catálogo público, que es donde el dueño ya está mirando su
// link/tienda. Se calcula sobre `fecha_pago_hasta` (la pone el superadmin a
// mano en /admin/tiendas al confirmar un pago) — no cobra ni avisa nada por
// su cuenta, solo hace visible lo que ya sabíamos.

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import type { Tienda } from "@/types";

const NUMERO_SOPORTE = process.env.NEXT_PUBLIC_SOPORTE_WHATSAPP;
const UMBRAL_AVISO_DIAS = 4;

export function diasHasta(fechaISO: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [year, month, day] = fechaISO.split("-").map(Number);
  const fecha = new Date(year, month - 1, day);
  return Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

// La clave incluye la fecha a propósito: si el superadmin renueva y pone
// una fecha nueva, el aviso vuelve a aparecer aunque el dueño hubiera
// cerrado el anterior — cerrar uno no debería silenciar el siguiente.
function claveCerrado(tiendaId: string, fecha: string): string {
  return `plan-aviso-cerrado-${tiendaId}-${fecha}`;
}

export function PlanRenewalBanner({ tienda }: { tienda: Tienda }) {
  const [cerrado, setCerrado] = useState(false);

  const dias =
    tienda.plan === "pro" && tienda.fecha_pago_hasta ? diasHasta(tienda.fecha_pago_hasta) : null;
  const debeAvisar = dias !== null && dias <= UMBRAL_AVISO_DIAS;

  useEffect(() => {
    if (!debeAvisar || !tienda.fecha_pago_hasta) return;
    try {
      const yaLoCerro =
        localStorage.getItem(claveCerrado(tienda.id, tienda.fecha_pago_hasta)) === "1";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (yaLoCerro) setCerrado(true);
    } catch {
      // localStorage puede fallar (ventana privada) — se queda visible, sin más.
    }
  }, [debeAvisar, tienda.id, tienda.fecha_pago_hasta]);

  if (!debeAvisar || cerrado || dias === null || !tienda.fecha_pago_hasta) return null;

  const vencido = dias < 0;
  const mensaje = vencido
    ? `Tu plan Pro venció hace ${Math.abs(dias)} ${Math.abs(dias) === 1 ? "día" : "días"}.`
    : dias === 0
      ? "Tu plan Pro vence hoy."
      : `Tu plan Pro vence en ${dias} ${dias === 1 ? "día" : "días"}.`;

  const whatsappHref = NUMERO_SOPORTE
    ? `https://wa.me/${NUMERO_SOPORTE}?text=${encodeURIComponent(
        `Hola, quiero renovar mi plan Pro de ${tienda.nombre}.`,
      )}`
    : null;

  function handleCerrar() {
    setCerrado(true);
    try {
      if (tienda.fecha_pago_hasta) {
        localStorage.setItem(claveCerrado(tienda.id, tienda.fecha_pago_hasta), "1");
      }
    } catch {
      // Ignorado a propósito — en el peor caso vuelve a aparecer la próxima vez.
    }
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2.5 rounded-lg border px-4 py-2.5 text-sm ${
        vencido ? "border-danger/30 bg-danger/10 text-danger" : "border-accent/30 bg-accent-soft text-accent"
      }`}
    >
      <span className="font-semibold">{mensaje} Escríbenos para renovar.</span>
      <div className="flex flex-none items-center gap-1.5">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-wa px-3 py-1.5 text-xs font-bold text-wa-ink transition-colors hover:bg-wa/90"
          >
            Renovar por WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={handleCerrar}
          aria-label="Cerrar aviso"
          className="flex h-6 w-6 items-center justify-center rounded-full text-current opacity-70 transition-opacity hover:opacity-100"
        >
          <CloseIcon width={12} height={12} />
        </button>
      </div>
    </div>
  );
}
