// Fase 5 (PLAN_EJECUCION.md): catálogo público del cliente final.
export default async function TiendaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="flex flex-1 flex-col p-8">
      <h1 className="text-xl font-semibold">Tienda: {slug}</h1>
    </main>
  );
}
