export type EstadoSuscripcion = "Activo" | "Inactivo";
export type PlanTienda = "gratis" | "pro";

export interface Tienda {
  id: string;
  user_id: string;
  nombre: string;
  store_code: string;
  telefono_whatsapp: string;
  estado_suscripcion: EstadoSuscripcion;
  // "gratis" tiene un límite de productos (LIMITE_PRODUCTOS_GRATIS en
  // services/products.ts); "pro" no tiene límite. Solo el superadministrador
  // puede cambiarlo (/admin/tiendas) — el dueño de la tienda no lo controla.
  plan: PlanTienda;
  // Personalización de marca (Fase 4b): null hasta que el dueño elige un
  // color propio — el catálogo público usa los colores por defecto de
  // globals.css mientras tanto. A propósito, esto es lo único de marca que
  // se puede personalizar (junto al nombre) — para que cada tienda tenga su
  // toque sin volverse un editor de diseño completo.
  color_primario: string | null;
  color_secundario: string | null;
  color_fondo: string | null;
  // Logo de la tienda — reemplaza el círculo con la inicial del nombre en el
  // catálogo público cuando está definido. Mismo bucket de Storage que las
  // fotos de producto (services/store.ts valida que la URL venga de ahí).
  logo_url: string | null;
  // Fecha hasta la que el dueño ya pagó (formato "YYYY-MM-DD") — la pone el
  // superadmin a mano en /admin/tiendas al confirmar un pago manual
  // (Nequi/Daviplata/transferencia). NULL si nunca se le puso fecha.
  fecha_pago_hasta: string | null;
  created_at: string;
}

export interface Producto {
  id: string;
  tienda_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  // Precio de oferta opcional: si tiene valor, es el que se cobra de verdad
  // y `precio` se muestra tachado como referencia. NULL = sin oferta.
  precio_descuento: number | null;
  imagen_url: string | null;
  // Hasta 2 fotos extra, además de imagen_url (que sigue siendo la
  // portada/tarjeta). Solo se muestran en el detalle expandido del catálogo.
  imagenes_adicionales: string[];
  stock: number;
  disponible: boolean;
  created_at: string;
}

export type EstadoPedido = "pendiente" | "completado" | "cancelado";

export interface ItemPedidoGuardado {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  // Referencia opcional al producto real (no requerida — ver comentario de
  // abajo) que sí se usa para una cosa puntual: devolver el stock si el
  // pedido se cancela (services/pedidos.ts). NULL si el producto ya no
  // existe cuando se guardó el pedido, o en pedidos guardados antes de que
  // existiera este campo.
  producto_id: string | null;
}

// Copia del pedido en el momento en que se hizo — el nombre/precio no
// referencian productos.id a propósito, para que borrar o repreciar un
// producto después no altere pedidos ya guardados. Ver supabase/schema.sql
// y services/pedidos.ts.
export interface Pedido {
  id: string;
  tienda_id: string;
  referencia: string;
  cliente_nombre: string;
  cliente_direccion: string;
  metodo_pago: string;
  items: ItemPedidoGuardado[];
  total: number;
  estado: EstadoPedido;
  created_at: string;
}

// Sistema de Licencias (multi-producto) — no es parte del catálogo/pedidos
// de Vitrina Digital; es el panel para administrar licencias de otros sistemas
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
  // Datos opcionales que manda la app al activar (no entran en la firma).
  negocio: string | null;
  responsable: string | null;
  telefono: string | null;
  terminos_version: string | null;
  terminos_aceptados_en: string | null;
  datos_recibidos_en: string | null;
  // Se enciende solo si negocio/teléfono cambian respecto a lo ya guardado;
  // no bloquea nada, es un aviso para que el operador contacte al cliente.
  revision_pendiente: boolean;
  revision_motivo: string | null;
  created_at: string;
  updated_at: string;
}
