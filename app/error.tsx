"use client";

// Convención de Next.js App Router: atrapa cualquier error no manejado que
// ocurra al renderizar una página (fuera de los try/catch que ya existen en
// los formularios) y muestra esto en vez de una pantalla en blanco o un 500
// crudo del navegador. Debe ser un Client Component.

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
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
    <main className="flex flex-1 flex-col items-center justify-center gap-3 bg-ground p-8 text-center">
      <h1 className="font-display text-xl">Algo salió mal</h1>
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
          href="/"
          className="rounded-md border border-line-strong px-5 py-2.5 text-sm font-bold text-ink-soft transition-colors hover:bg-ink/5"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
