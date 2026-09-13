"use client";

// Guía de primeros pasos para un tendero recién registrado — antes no había
// ninguna, y los primeros minutos en un panel vacío pueden sentirse
// perdidos. Se calcula sobre datos reales (no hay columnas nuevas en la
// base de datos, salvo si ya compartió el link, que solo importa en este
// navegador) y desaparece sola cuando ya completó todo, o si el dueño la
// oculta a mano.

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckIcon, CloseIcon, CopyIcon, PlusIcon } from "@/components/icons";
import type { Tienda } from "@/types";

function claveOculto(tiendaId: string) {
  return `onboarding-oculto-${tiendaId}`;
}
function claveCompartido(tiendaId: string) {
  return `onboarding-compartido-${tiendaId}`;
}

export function OnboardingChecklist({
  tienda,
  cantidadProductos,
  onAgregarProducto,
}: {
  tienda: Tienda;
  cantidadProductos: number;
  onAgregarProducto: () => void;
}) {
  // Arranca oculto y solo se muestra tras confirmar en el cliente que no fue
  // descartado antes — evita un parpadeo (aparece y luego desaparece) para
  // quien ya lo ocultó, y no depende de localStorage durante el render del
  // servidor (que no existe ahí).
  const [listo, setListo] = useState(false);
  const [oculto, setOculto] = useState(true);
  const [compartido, setCompartido] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    // Se resuelve tras montar (no en el render inicial) a propósito: el
    // servidor no conoce localStorage, así que arrancar oculto y recién acá
    // decidir si se muestra evita un mismatch de hidratación entre server y
    // cliente (mismo patrón que theme-toggle.tsx).
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOculto(localStorage.getItem(claveOculto(tienda.id)) === "1");
      setCompartido(localStorage.getItem(claveCompartido(tienda.id)) === "1");
    } catch {
      // localStorage puede fallar (ventana privada) — se queda visible, sin más.
    }
    setListo(true);
  }, [tienda.id]);

  const pasos = [
    {
      id: "producto",
      label: "Agrega tu primer producto",
      hecho: cantidadProductos > 0,
    },
    {
      id: "whatsapp",
      label: "Agrega el WhatsApp de tu negocio",
      hecho: tienda.telefono_whatsapp.length > 0,
    },
    {
      id: "logo",
      label: "Sube el logo de tu tienda",
      hecho: Boolean(tienda.logo_url),
    },
    {
      id: "compartir",
      label: "Comparte el link de tu catálogo",
      hecho: compartido,
    },
  ];

  const completados = pasos.filter((p) => p.hecho).length;

  if (!listo || oculto || completados === pasos.length) return null;

  function handleOcultar() {
    setOculto(true);
    try {
      localStorage.setItem(claveOculto(tienda.id), "1");
    } catch {
      // Ignorado a propósito — en el peor caso vuelve a aparecer la próxima vez.
    }
  }

  async function handleCompartir() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/store/${tienda.store_code}`);
      setCopiado(true);
      setCompartido(true);
      localStorage.setItem(claveCompartido(tienda.id), "1");
      window.setTimeout(() => setCopiado(false), 1600);
    } catch {
      // Si el navegador bloquea el portapapeles, el link se puede copiar
      // igual desde el botón de arriba de "Tu catálogo público".
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-accent/30 bg-accent-soft p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent">
            Primeros pasos{" "}
            <span className="font-normal text-ink-faint">
              · {completados}/{pasos.length}
            </span>
          </p>
          <p className="text-xs text-ink-soft">Completa esto para dejar tu tienda lista para vender.</p>
        </div>
        <button
          type="button"
          onClick={handleOcultar}
          aria-label="Ocultar esta lista"
          className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <CloseIcon width={12} height={12} />
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {pasos.map((paso) => (
          <li key={paso.id} className="flex items-center gap-2.5 text-sm">
            <span
              className={`flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                paso.hecho ? "bg-wa text-wa-ink" : "border border-line-strong text-transparent"
              }`}
            >
              <CheckIcon width={11} height={11} />
            </span>
            <span className={paso.hecho ? "text-ink-faint line-through" : "text-ink"}>
              {paso.label}
            </span>

            {!paso.hecho && paso.id === "producto" && (
              <button
                type="button"
                onClick={onAgregarProducto}
                className="ml-auto flex flex-none items-center gap-1 text-xs font-bold text-accent underline underline-offset-2"
              >
                <PlusIcon width={11} height={11} />
                Agregar
              </button>
            )}
            {!paso.hecho && (paso.id === "whatsapp" || paso.id === "logo") && (
              <Link
                href="/dashboard/perfil"
                className="ml-auto flex-none text-xs font-bold text-accent underline underline-offset-2"
              >
                Ir a Perfil
              </Link>
            )}
            {!paso.hecho && paso.id === "compartir" && (
              <button
                type="button"
                onClick={handleCompartir}
                className="ml-auto flex flex-none items-center gap-1 text-xs font-bold text-accent underline underline-offset-2"
              >
                <CopyIcon width={11} height={11} />
                {copiado ? "Copiado" : "Copiar link"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
