import Link from "next/link";

// Convención de Next.js App Router: se muestra automáticamente para
// cualquier ruta que no existe, en toda la app.
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 bg-ground p-8 text-center">
      <p className="font-display text-6xl text-ink-faint">404</p>
      <h1 className="font-display text-xl">Esta página no existe</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Revisa el link — puede que esté mal escrito o que la página se haya movido.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
