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
    nombre: "Esqueleto deportivo negro",
    descripcion: "Camiseta esqueleto deportiva para hombre.",
    precio: 35000,
    imagen_url:
      "https://firebasestorage.googleapis.com/v0/b/alma-botaninca.firebasestorage.app/o/products%2F23fafae8-960e-4b27-b8f1-f9c4f82a917b-Esqueleto-Deportivo-Color-Negro-Para-Hombre.webp?alt=media",
    stock: 18,
    disponible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "p6",
    tienda_id: MOCK_TIENDA.id,
    nombre: "Camisa blanca",
    descripcion: "Camisa clásica de vestir.",
    precio: 45000,
    imagen_url:
      "https://firebasestorage.googleapis.com/v0/b/alma-botaninca.firebasestorage.app/o/products%2F88b577b4-d3e9-4100-a711-85d6f60ff478-camisa_blanca.png?alt=media",
    stock: 10,
    disponible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "p7",
    tienda_id: MOCK_TIENDA.id,
    nombre: "Blusa blanca de tiras",
    descripcion: "Blusa liviana con detalle de volante.",
    precio: 38000,
    imagen_url:
      "https://firebasestorage.googleapis.com/v0/b/alma-botaninca.firebasestorage.app/o/products%2Fe9bf1040-31b1-4598-a900-b5880b62f6d1-Captura%20de%20pantalla%202026-03-28%20213849.png?alt=media",
    stock: 0,
    disponible: true,
    created_at: new Date().toISOString(),
  },
];

export function getMockTiendaByCode(code: string): Tienda | null {
  return code.toUpperCase() === MOCK_TIENDA.store_code ? MOCK_TIENDA : null;
}
