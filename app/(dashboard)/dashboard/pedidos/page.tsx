import { PedidosPanel } from "@/components/pedidos-panel";
import { requireTienda } from "@/lib/auth/session";
import { listarPedidosByTiendaId } from "@/services/pedidos";

// Control de pedidos: historial de lo que se ha pedido desde el catálogo
// público, guardado desde checkout-modal.tsx al momento de la compra.
export default async function DashboardPedidosPage() {
  const tienda = await requireTienda();
  const pedidos = await listarPedidosByTiendaId(tienda.id);

  return <PedidosPanel pedidosIniciales={pedidos} />;
}
