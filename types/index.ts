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
// (hoy: CajaSimple, un POS/inventario de escritorio) desde la misma base
// de datos. Ver PLAN_EJECUCION.md, anexo "Sistema de Licencias".

// Lo que el admin controla manualmente (columna `estado` en la BD).
export type EstadoLicenciaAdmin = "ACTIVA" | "DESHABILITADA";

// Lo que el endpoint de validación puede devolver — incluye estados
// derivados que no se guardan en la BD (calculados al validar). CajaSimple
// trata cualquier valor distinto de "ACTIVA" como bloqueado, así que
// agregar más valores aquí no rompe su lógica existente.
export type EstadoLicenciaValidacion =
  | EstadoLicenciaAdmin
  | "INVALIDA"
  | "VENCIDA"
  | "HARDWARE_NO_COINCIDE";

export interface Licencia {
  id: string;
  licencia_key: string;
  producto: string;
  hardware_id: string | null;
  cliente_nombre: string;
  tienda_id: string | null;
  estado: EstadoLicenciaAdmin;
  fecha_vencimiento: string | null;
  created_at: string;
  updated_at: string;
}
