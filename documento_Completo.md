Documento de Planificación Técnica y de Negocio: VentaFácil 

1. Resumen Ejecutivo 

Nombre del Proyecto: VentaFácil (Catálogo e Inventario para WhatsApp). 

Objetivo: Permitir a micronegocios en el Huila (Isnos, Pitalito) gestionar stock y recibir pedidos organizados vía WhatsApp sin costos de infraestructura inicial. 

Propuesta de Valor: "Dinero rápido" (Time-to-market de 1 semana), costo $0 de mantenimiento y solución efectiva al desorden en ventas por chat mediante la automatización del formato de pedido. 

2. Arquitectura Técnica (Stack "Costo Cero") 

La arquitectura se ha diseñado para eliminar gastos operativos fijos, permitiendo que el 100% de los ingresos por suscripción sean utilidad neta para el desarrollador. 

Frontend: Next.js (App Router) con TypeScript. Se prioriza el renderizado del lado del servidor (SSR) para velocidad y SEO. Desplegado en Vercel (Plan Gratuito). 

Backend: Arquitectura Serverless. La lógica de negocio reside en Next.js Server Actions, eliminando la necesidad de un servidor Node.js/Express tradicional corriendo 24/7. 

Base de Datos & Auth: Supabase (PostgreSQL). Provee autenticación lista para usar, base de datos relacional y almacenamiento de imágenes (Storage) en su capa gratuita. 

Comunicación: Uso exclusivo de enlaces dinámicos wa.me (URL Scheme). Esto permite enviar el contenido del carrito formateado directamente al chat del dueño sin depender de la API de Meta/WhatsApp Business. 

Pagos: Estrategia híbrida. Para el MVP, se usará un botón manual con instrucciones para Nequi/Daviplata. La integración de pasarelas como Wompi/ePayco queda como opción futura basada en comisión por venta. 

3. Estructura de Archivos del Proyecto 

Organización basada en un monorepo de Next.js optimizado para escalabilidad: 

/[Salto de ajuste de texto]├── app/[Salto de ajuste de texto]│   ├── (auth)/             # Login y Registro de dueños de negocios[Salto de ajuste de texto]│   ├── (dashboard)/        # Panel administrativo: /dashboard/productos, /settings[Salto de ajuste de texto]│   ├── (public)/           # Catálogo: /tienda/[slug] (Vista del cliente)[Salto de ajuste de texto]│   ├── layout.tsx          # Configuración de fuentes y RootLayout[Salto de ajuste de texto]│   └── page.tsx            # Landing page del SaaS[Salto de ajuste de texto]├── components/[Salto de ajuste de texto]│   ├── ui/                 # Componentes base (Botones, Inputs, Modales)[Salto de ajuste de texto]│   ├── admin/              # Formularios de carga de productos, lista de inventario[Salto de ajuste de texto]│   └── store/              # Carrito flotante, tarjetas de producto, categorías[Salto de ajuste de texto]├── lib/[Salto de ajuste de texto]│   ├── supabase.ts         # Cliente de Supabase (configuración inicial)[Salto de ajuste de texto]│   └── whatsapp.ts         # Utilidad para formatear el mensaje y generar el link wa.me[Salto de ajuste de texto]├── services/               # Server Actions (Lógica de servidor)[Salto de ajuste de texto]│   ├── auth.actions.ts     # Manejo de sesiones[Salto de ajuste de texto]│   └── product.actions.ts  # CRUD de productos conectado a Supabase[Salto de ajuste de texto]├── types/[Salto de ajuste de texto]│   └── index.ts            # Interfaces de TypeScript (Tienda, Producto, Plan)[Salto de ajuste de texto]├── hooks/[Salto de ajuste de texto]│   └── useCart.ts          # Gestión del estado local del carrito en el navegador[Salto de ajuste de texto]└── supabase/[Salto de ajuste de texto]    └── schema.sql          # Definición de tablas y políticas RLS[Salto de ajuste de texto] 

4. Modelo de Datos (Esquema Sugerido) 

Se implementarán políticas de Row Level Security (RLS) en Supabase para garantizar que cada dueño solo pueda modificar sus datos. 

Tabla tiendas: 

id (UUID, PK), owner_id (FK a auth.users), nombre, slug (único), whatsapp_phone, plan_tipo (Semilla/Emprendedor), estado_suscripcion (Activo/Inactivo). 

Tabla productos: 

id (UUID, PK), tienda_id (FK), nombre, precio, stock, imagen_url, categoria. 

Tabla pedidos (Opcional para MVP): 

id, tienda_id, detalles_json (Resumen del pedido), monto_total, fecha. 

5. Plan de Negocio y Monetización 

Plan "Semilla" (Gratis): Límite de 10 productos, gestión de stock desactivada. Ideal para pruebas iniciales. 

Plan "Emprendedor" ($25.000 - $30.000 COP/mes): Catálogo de hasta 100 productos, gestión de stock automática, link personalizado sin marca de agua. 

Plan "Empresa" ($60.000+ COP/mes): Pendiente de decisión futura (posible multi-usuario o reportes). 

Modelo de Cobro: 

Instalación Inicial: Entre $150.000 y $300.000 COP por configuración, carga de fotos inicial y capacitación rápida. 

Recurrencia: Suscripción mensual para mantener el servicio activo. 

Estrategia de Ventas: Enfoque directo en Isnos y Pitalito con 5 clientes semilla (ferreterías, tiendas de ropa, depósitos de café). 

6. Hoja de Ruta del MVP (Producto Mínimo Viable) 

Autenticación: Login seguro para el dueño del negocio. 

Panel Admin: Interfaz móvil para crear/editar productos y subir fotos. 

Catálogo Público: Interfaz Mobile-First, rápida y visual para el cliente. 

Carrito Local: Almacenamiento temporal de productos en el dispositivo del cliente. 

Acción Final: Generación del mensaje: "Hola [Tienda], quiero pedir: 2x Arroz, 1x Aceite. Total: $X. Mi dirección es: ...". 

Control de Acceso: Lógica que oculta el catálogo si el estado_suscripcion es "Inactivo". 

7. Próximos Pasos Inmediatos 

Generar el esquema SQL exacto para ejecutar en la consola de Supabase. 

Implementar el primer Server Action para la función createProduct. 

Diseñar los "Wireframes" de la interfaz del catálogo pensando 100% en el uso desde celulares (Mobile First). 