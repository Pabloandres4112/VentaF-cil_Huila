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
