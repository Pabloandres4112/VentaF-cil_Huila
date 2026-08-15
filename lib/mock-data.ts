// Datos de ejemplo para poder construir y probar el catálogo público antes
// de que exista el proyecto de Supabase (Fase 1, en pausa a propósito).
// Cuando se conecte Supabase, esto se reemplaza por `getTiendaByCode` /
// `getProductosByTiendaId` en services/store.ts y services/products.ts.

import type { Producto, Tienda } from "@/types";

export const MOCK_TIENDA: Tienda = {
  id: "mock-tienda-1",
  user_id: "mock-user-1",
  nombre: "Donde Marleny",
  store_code: "DEMO01",
  telefono_whatsapp: "573001234567",
  estado_suscripcion: "Activo",
  created_at: new Date().toISOString(),
};

export const MOCK_PRODUCTOS: Producto[] = [
  {
    id: "p1",
    tienda_id: MOCK_TIENDA.id,
    nombre: "Arroz Diana 500g",
    descripcion: "Arroz blanco de grano largo.",
    precio: 2500,
    imagen_url: null,
    stock: 40,
    disponible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "p2",
    tienda_id: MOCK_TIENDA.id,
    nombre: "Café Huila 500g",
    descripcion: "Café de origen, tueste medio.",
    precio: 14000,
    imagen_url: null,
    stock: 15,
    disponible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "p3",
    tienda_id: MOCK_TIENDA.id,
    nombre: "Aceite Gourmet 1L",
    descripcion: "Aceite vegetal mixto.",
    precio: 9800,
    imagen_url: null,
    stock: 0,
    disponible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "p4",
    tienda_id: MOCK_TIENDA.id,
    nombre: "Panela 1kg",
    descripcion: "Panela redonda tradicional.",
    precio: 4500,
    imagen_url: null,
    stock: 25,
    disponible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "p5",
    tienda_id: MOCK_TIENDA.id,
    nombre: "Chocolate Corona x12",
    descripcion: "Pastillas de chocolate para mesa.",
    precio: 8200,
    imagen_url: null,
    stock: 12,
    disponible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "p6",
    tienda_id: MOCK_TIENDA.id,
    nombre: "Azúcar Blanca 1kg",
    descripcion: "Azúcar refinada.",
    precio: 3900,
    imagen_url: null,
    stock: 30,
    disponible: true,
    created_at: new Date().toISOString(),
  },
];

export function getMockTiendaByCode(code: string): Tienda | null {
  return code.toUpperCase() === MOCK_TIENDA.store_code ? MOCK_TIENDA : null;
}
