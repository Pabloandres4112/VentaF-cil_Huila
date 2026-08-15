// Fase 5 (PLAN_EJECUCION.md): catálogo público del cliente final.
export default async function StorePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <main className="flex flex-1 flex-col p-8">
      <h1 className="text-xl font-semibold">Tienda: {code}</h1>
    </main>
  );
}
