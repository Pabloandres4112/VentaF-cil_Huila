"use client";

// Igual que app/error.tsx (raíz) pero propio de /dashboard/* — si algo
// falla en Productos, Pedidos o Perfil, el dueño ve un mensaje contextual
// con un botón para volver a su panel en vez de la pantalla genérica de
// toda la app.

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <h1 className="font-display text-xl">Algo salió mal en tu panel</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Ocurrió un error inesperado. Intenta de nuevo — si sigue pasando, escríbenos.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
        >
          Reintentar
        </button>
        <Link
          href="/dashboard"
          className="rounded-md border border-line-strong px-5 py-2.5 text-sm font-bold text-ink-soft transition-colors hover:bg-ink/5"
        >
          Ir a mis productos
        </Link>
      </div>
    </div>
  );
}
