"use client";

// Fase 6 (PLAN_EJECUCION.md): carrito flotante con badge, total y checkout.

import type { CartItem } from "@/hooks/useCart";

export function CartDrawer({ items, total }: { items: CartItem[]; total: number }) {
  return (
    <aside className="fixed bottom-4 right-4 rounded-full border bg-white px-4 py-2 shadow">
      🛒 {items.length} · ${total}
    </aside>
  );
}
