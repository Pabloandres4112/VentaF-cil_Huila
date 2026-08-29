export type EstadoSuscripcion = "Activo" | "Inactivo";

export interface Tienda {
  id: string;
  user_id: string;
  nombre: string;
  store_code: string;
  telefono_whatsapp: string;
  estado_suscripcion: EstadoSuscripcion;
  created_at: string;
}

export interface Producto {
  id: string;
  tienda_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  created_at: string;
}

// Sistema de Licencias (multi-producto) — no es parte del catálogo/pedidos
// de VentaFácil; es el panel para administrar licencias de otros sistemas
// (ej. una app de inventario local) desde la misma base de datos.
// Ver PLAN_EJECUCION.md, anexo "Sistema de Licencias".
export type EstadoLicencia = "Activo" | "Inactivo" | "Suspendido";

export interface Licencia {
  id: string;
  codigo: string;
  producto: string;
  cliente_nombre: string;
  tienda_id: string | null;
  estado: EstadoLicencia;
  fecha_corte: string | null;
  created_at: string;
}
