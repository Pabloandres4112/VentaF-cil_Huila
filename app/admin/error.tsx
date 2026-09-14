"use client";

// Igual que app/error.tsx (raíz) pero propio de /admin/* — si algo falla acá
// (ej. la service role key mal puesta, una consulta que truena) el
// superadmin ve un mensaje y un botón para volver a intentar sin perder el
// contexto de que sigue dentro del panel de administración.

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
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
      <h1 className="font-display text-xl">Algo salió mal en el panel</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Ocurrió un error inesperado cargando esta sección de administración.
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
          href="/admin/tiendas"
          className="rounded-md border border-line-strong px-5 py-2.5 text-sm font-bold text-ink-soft transition-colors hover:bg-ink/5"
        >
          Ir a Tiendas
        </Link>
      </div>
    </main>
  );
}
