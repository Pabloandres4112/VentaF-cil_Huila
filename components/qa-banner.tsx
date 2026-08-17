// Salvaguarda visual para no confundir el entorno de pruebas con producción.
// Se controla con NEXT_PUBLIC_APP_ENV (ver .env.local.example). Si la
// variable no está definida, se asume QA a propósito (falla del lado seguro).
export function QaBanner() {
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") return null;

  return (
    <div className="bg-ink py-1.5 text-center text-[0.7rem] font-bold uppercase tracking-wide text-ground">
      Entorno de pruebas (QA) — no ingreses datos reales de clientes
    </div>
  );
}
