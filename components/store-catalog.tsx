"use client";

// Orquesta el catálogo público: grid de productos + carrito + checkout.

import { useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/checkout-modal";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/hooks/useCart";
import type { Producto, Tienda } from "@/types";

export function StoreCatalog({ tienda, productos }: { tienda: Tienda; productos: Producto[] }) {
  const { items, addItem, setCantidad, clearCart, total, cantidadTotal } = useCart(tienda.id);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function increment(productoId: string) {
    const item = items.find((i) => i.producto.id === productoId);
    if (item) setCantidad(productoId, item.cantidad + 1);
  }

  function decrement(productoId: string) {
    const item = items.find((i) => i.producto.id === productoId);
    if (item) setCantidad(productoId, item.cantidad - 1);
  }

  return (
    <>
      {productos.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-soft">
          Esta tienda todavía no tiene productos disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} onAdd={addItem} />
          ))}
        </div>
      )}

      <CartDrawer
        items={items}
        total={total}
        cantidadTotal={cantidadTotal}
        onIncrement={increment}
        onDecrement={decrement}
        onCheckout={() => setCheckoutOpen(true)}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        total={total}
        tiendaNombre={tienda.nombre}
        telefonoWhatsapp={tienda.telefono_whatsapp}
        onConfirmado={() => {
          clearCart();
          setCheckoutOpen(false);
        }}
      />
    </>
  );
}
