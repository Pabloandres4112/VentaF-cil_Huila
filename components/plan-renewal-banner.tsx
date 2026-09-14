// Aviso de vencimiento del plan Pro — se muestra en todo el dashboard
// (no solo en Perfil) para que el dueño se entere apenas entra, sin tener
// que ir a revisar. Se calcula sobre `fecha_pago_hasta` (la pone el
// superadmin a mano en /admin/tiendas al confirmar un pago) — no cobra ni
// avisa nada por su cuenta, solo hace visible lo que ya sabíamos.

import type { Tienda } from "@/types";

const NUMERO_SOPORTE = process.env.NEXT_PUBLIC_SOPORTE_WHATSAPP;
const UMBRAL_AVISO_DIAS = 5;

function diasHasta(fechaISO: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [year, month, day] = fechaISO.split("-").map(Number);
  const fecha = new Date(year, month - 1, day);
  return Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

export function PlanRenewalBanner({ tienda }: { tienda: Tienda }) {
  if (tienda.plan !== "pro" || !tienda.fecha_pago_hasta) return null;

  const dias = diasHasta(tienda.fecha_pago_hasta);
  if (dias > UMBRAL_AVISO_DIAS) return null;

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

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-2.5 text-sm sm:px-8 ${
        vencido ? "border-danger/30 bg-danger/10 text-danger" : "border-accent/30 bg-accent-soft text-accent"
      }`}
    >
      <span className="font-semibold">
        {mensaje} Escríbenos para renovar y seguir sin límite de productos.
      </span>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none rounded-md bg-wa px-3.5 py-1.5 text-xs font-bold text-wa-ink transition-colors hover:bg-wa/90"
        >
          Renovar por WhatsApp
        </a>
      )}
    </div>
  );
}
