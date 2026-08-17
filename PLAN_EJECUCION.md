# 📋 VentaFácil Huila — Documento Maestro de Ejecución

> Este es el **documento único de referencia** a partir de ahora. Consolida `README.md`, `INSTRUCCIONES_PROYECTO.md` y `documento_Completo.md` en una sola fuente de verdad. No se agrega nada fuera de lo ya definido en esos 3 archivos — solo se organiza y se prioriza para ejecutar el MVP sin desviarnos.

---

## 1. Resumen del Proyecto

- **Nombre:** VentaFácil Huila
- **Qué es:** SaaS de catálogo digital + inventario para micronegocios (Isnos, Pitalito, Huila) que reciben pedidos organizados por WhatsApp.
- **Propuesta de valor:** El comerciante crea su catálogo en minutos, el cliente compra sin fricción, y el pedido llega formateado directo al WhatsApp del dueño, descontando inventario.
- **Objetivo de negocio:** Suscripción mensual + instalación inicial ($150.000–$300.000 COP). Costo de infraestructura = **$0** mientras el proyecto sea pequeño.

---

## 2. Reglas de Oro (No negociables para el MVP)

1. **No agregar dependencias ni librerías pesadas** fuera de las listadas en la sección 3.
2. **No usar la API oficial de WhatsApp Business (Meta API)**. Solo enlaces `wa.me` generados dinámicamente.
3. **No integrar pasarelas de pago automáticas** (Stripe, MercadoPago, Wompi, ePayco, etc.) en el MVP. Pago = instrucciones manuales (Nequi/Daviplata/Efectivo).
4. **Mobile-First absoluto**: catálogo público y panel admin deben funcionar perfecto en celular primero.
5. **Costo de infraestructura = $0**: Next.js Server Actions + Supabase Free Tier + Vercel Free Tier. Nada de servidor Express corriendo 24/7.
6. No construir funcionalidades de los planes "Emprendedor"/"Empresa" (multiusuario, reportes, dominio propio, alertas de stock) hasta que el MVP esté validado.
7. **Cero emojis en todo el producto** (UI, mensajes de WhatsApp, textos). Donde se necesite un elemento visual, usar iconos (SVG), no emojis.
8. **Paleta de colores minimalista y profesional**: tonos neutros (grises/slate), un acento sobrio por marca, nada de paletas cálidas/decorativas. El verde de WhatsApp se reserva exclusivamente para acciones/elementos relacionados con WhatsApp.

---

## 3. Stack Tecnológico (definitivo)

| Capa | Tecnología |
| :--- | :--- |
| Frontend | Next.js 14+ (App Router) + TypeScript |
| Estilos | Tailwind CSS + Lucide Icons |
| Backend / lógica | Next.js Server Actions (sin Express, sin API REST aparte) |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth (email/contraseña, solo para el dueño) |
| Almacenamiento de imágenes | Supabase Storage (bucket `productos`) |
| Comunicación con cliente final | Enlaces `wa.me` (sin backend de mensajería) |
| Despliegue | Vercel (plan gratuito) |
| Gestor de paquetes | **pnpm** (no usar `npm`/`npm install`, evita descargas y duplicados innecesarios de `node_modules`) |

---

## 4. Estructura del Proyecto (definitiva)

```text
ventafacil/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Login (UI lista, falta conectar Supabase)
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── layout.tsx          # Nav del panel (Productos/Perfil) + tema
│   │       ├── page.tsx            # Inventario (usa DashboardInventory)
│   │       └── perfil/page.tsx     # Perfil de tienda (usa DashboardProfile)
│   ├── store/
│   │   └── [code]/page.tsx         # Catálogo público (header + StoreCatalog)
│   ├── en/page.tsx                 # Home en inglés
│   ├── layout.tsx                  # Fuente, script de tema, lang="es"
│   ├── page.tsx                    # Home en español
│   └── globals.css                 # Tokens de color (claro/oscuro) + Tailwind
├── components/
│   ├── home-content.tsx            # Contenido de la Home (parametrizado por idioma)
│   ├── language-switcher.tsx       # Switch ES/EN (solo Home)
│   ├── theme-toggle.tsx            # Switch claro/oscuro
│   ├── icons.tsx                   # Íconos SVG del proyecto (sin emojis)
│   ├── store-catalog.tsx           # Orquesta grid + carrito + checkout
│   ├── ProductCard.tsx             # Tarjeta de producto (catálogo público)
│   ├── CartDrawer.tsx              # Carrito (bottom sheet mobile / panel desktop)
│   ├── checkout-modal.tsx          # Modal de checkout → genera link de WhatsApp
│   ├── dashboard-inventory.tsx     # CRUD de productos del panel admin
│   ├── dashboard-profile.tsx       # Edición de perfil de tienda
│   ├── ProductForm.tsx             # Modal crear/editar producto
│   └── toggle-switch.tsx           # Switch on/off reutilizable
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Cliente Supabase navegador (scaffold)
│   │   └── server.ts                # Cliente Supabase servidor (scaffold)
│   ├── i18n/                        # Diccionarios ES/EN de la Home
│   ├── whatsapp.ts                  # Generador del mensaje + enlace wa.me
│   ├── mock-data.ts                 # Tienda/productos de ejemplo (sin Supabase)
│   └── utils.ts                     # formatCOP()
├── services/
│   ├── products.ts                  # Server Actions de Productos (contra Supabase)
│   └── store.ts                     # Server Actions de Tiendas (contra Supabase)
├── types/
│   └── index.ts                     # Interfaces TypeScript (Tienda, Producto)
├── hooks/
│   ├── useCart.ts                   # Carrito del cliente (localStorage)
│   ├── useMockInventory.ts          # CRUD de productos de ejemplo (localStorage)
│   ├── useMockTienda.ts             # Perfil de tienda de ejemplo (localStorage)
│   └── useBodyScrollLock.ts         # Bloquea el scroll de fondo con modales abiertos
└── supabase/
    └── schema.sql                   # Definición de tablas y políticas RLS
```

*(La estructura original venía de `INSTRUCCIONES_PROYECTO.md`; esta versión refleja lo que realmente existe hoy en el proyecto.)*

---

## 5. Modelo de Datos — Esquema SQL Definitivo (Supabase)

Este es el script exacto a ejecutar en el editor SQL de Supabase (fuente: `INSTRUCCIONES_PROYECTO.md`):

```sql
-- 1. Tabla de Tiendas (Perfiles de Comercio)
CREATE TABLE public.tiendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  -- Código único e inmutable de la tienda (auto-generado, sin importar si la
  -- crea el cliente en self-service o la crea el equipo de VentaFácil en un
  -- alta asistida). Es el único identificador público: /store/A3F9C2
  store_code TEXT UNIQUE NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  telefono_whatsapp TEXT NOT NULL, -- Ej: '573001234567' (sin signo +)
  estado_suscripcion TEXT DEFAULT 'Activo' CHECK (estado_suscripcion IN ('Activo', 'Inactivo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Productos
CREATE TABLE public.productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tienda_id UUID REFERENCES public.tiendas(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL,
  imagen_url TEXT,
  stock INT DEFAULT 0,
  disponible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para Productos
CREATE POLICY "Productos visibles públicamente" ON public.productos
  FOR SELECT USING (true);

CREATE POLICY "Solo dueño modifica sus productos" ON public.productos
  FOR ALL USING (
    tienda_id IN (SELECT id FROM public.tiendas WHERE user_id = auth.uid())
  );

-- Políticas de Seguridad para Tiendas
CREATE POLICY "Tiendas visibles públicamente" ON public.tiendas
  FOR SELECT USING (true);

CREATE POLICY "Solo dueño modifica su tienda" ON public.tiendas
  FOR ALL USING (user_id = auth.uid());
```

> **Nota:** el README/documento_Completo mencionaban además una tabla `pedidos` y una columna `plan_tipo` (para diferenciar Semilla/Emprendedor/Empresa). Ambas quedan **fuera del MVP**: no hay pasarela de pago automática ni gestión de planes por ahora (regla de oro #3 y #6), así que no se crean todavía. Se documentan en la sección 9 como backlog futuro.

> **Nota (cambio de decisión):** el campo `slug` (elegible por el usuario) de las versiones iniciales del esquema se reemplazó por `store_code` — un código único, corto e **inmutable**, generado automáticamente por la base de datos sin importar si la tienda la crea el cliente (self-service) o el equipo de VentaFácil (alta asistida, plan "Promo Lanzamiento"). Objetivo: un solo identificador confiable por tienda para evitar cualquier cruce de datos entre negocios, y una URL pública predecible: `/store/[code]` (ej. `ventafacil.com/store/A3F9C2`).

---

## 6. Alcance del MVP

### Incluido (Fase 1 del producto)

**Para el Dueño del Negocio:**
- Registro e inicio de sesión (Supabase Auth).
- Configuración de tienda: nombre, store_code, número de WhatsApp.
- CRUD completo de productos (nombre, descripción, precio, stock, imagen, disponible on/off).
- Subida de imágenes a Supabase Storage (bucket `productos`).
- Link único de catálogo para compartir (`/store/[code]`).

**Para el Cliente Final:**
- Vista de catálogo público, mobile-first.
- Carrito de compras local (localStorage / estado de React, sin necesidad de cuenta).
- Sumar/restar cantidades, contador y total en carrito flotante.
- Modal de checkout: nombre, dirección, método de pago (Nequi/Daviplata/Efectivo).
- Botón "Enviar pedido a WhatsApp" que arma el mensaje y redirige a `wa.me`.

**Control de acceso:**
- Si `estado_suscripcion = 'Inactivo'`, el catálogo público muestra "Tienda no disponible temporalmente".

### Explícitamente fuera del MVP (backlog, no tocar todavía)
- Pasarelas de pago automáticas (Wompi, ePayco, Stripe, MercadoPago).
- API oficial de WhatsApp Business (Meta).
- Tabla y lógica de `pedidos` (historial de ventas).
- Gestión de planes (`plan_tipo`), límites de productos por plan, upgrade/downgrade.
- Multiusuario, reportes, dominio propio, alertas de stock bajo (features del plan "Empresa").
- Personalización de marca/colores (plan "Emprendedor" avanzado).

---

## 7. Roles del Sistema

1. **Administrador del Comercio (Dueño):** acceso a `/dashboard`, gestiona solo sus propios productos y tienda (protegido por RLS). No ve datos de otros comercios.
2. **Cliente Final:** solo accede a `/store/[code]`, sin necesidad de cuenta, experiencia de navegación y compra.

---

## 8. Plan de Ejecución por Capas

El orden respeta dependencias técnicas: primero la infraestructura de datos, luego auth, luego lógica de servidor, luego UI admin, luego UI pública, y al final integración + despliegue.

### Fase 0 — Setup del Proyecto ✅ Hecho
- Proyecto Next.js 16 (App Router) + TypeScript + Tailwind CSS + pnpm, ya creado y corriendo.
- Pendiente solo lo de Supabase (URL/ANON_KEY) y Vercel — ver Fase 1.

### Fase 1 — Capa de Datos (Supabase) ⏸️ En pausa (a cargo del usuario)
- Ejecutar el script SQL de la sección 5 (tablas `tiendas`, `productos` + RLS).
- Crear bucket `productos` en Supabase Storage con política de acceso pública de lectura.
- Verificar políticas RLS con pruebas manuales (un usuario no debe poder modificar datos de otra tienda).

### Fase 2 — Capa de Autenticación ⏸️ Solo UI, sin conectar
- `app/(auth)/login/page.tsx`: formulario completo (correo/contraseña), pero **no está conectado** a Supabase todavía — falta el proyecto real (Fase 1).
- Pendiente: `lib/supabase/client.ts`/`server.ts` (ya existen como scaffold, listos para las credenciales reales), y middleware de sesión para proteger `(dashboard)`.

### Fase 3 — Capa de Lógica de Servidor (Server Actions) ⏸️ Scaffold listo, sin datos reales
- `services/store.ts` y `services/products.ts` ya tienen las consultas escritas (`getTiendaByCode`, `getProductosByTiendaId`, etc.) apuntando a Supabase — no se pueden probar hasta la Fase 1.
- Mientras tanto, el dashboard y el catálogo usan datos de ejemplo editables en `localStorage` (`lib/mock-data.ts`, `hooks/useMockInventory.ts`, `hooks/useMockTienda.ts`) para poder construir y probar toda la UI.

### Fase 4 — Capa de Panel Admin (`/dashboard`) ✅ Hecho (con datos de ejemplo)
- `/dashboard`: listar, crear, editar, eliminar productos (`ProductForm.tsx` como modal), toggle de disponibilidad, link del catálogo con copiar/ver.
- `/dashboard/perfil`: editar nombre de tienda y WhatsApp; `store_code` visible mostrado como inmutable.
- Sin guard de sesión todavía (llega con Fase 2). Datos persistidos en `localStorage` vía `useMockInventory`/`useMockTienda` — al conectar Supabase, se reemplazan por Server Actions reales.
- `components/image-upload.tsx`: subir foto por drag-and-drop o selección de archivo (no una URL). Se comprime en el navegador (máx. 900px, JPEG) y por ahora queda incrustada como imagen local — cuando se conecte Supabase Storage (Fase 1), el mismo componente sube el archivo comprimido al bucket `productos` y usa la URL real; la UI del formulario no cambia.

### Fase 5 — Capa de Catálogo Público (`/store/[code]`) ✅ Hecho (con datos de ejemplo)
- Tienda + grid de productos disponibles, con estado "no encontrada" y "no disponible" (`estado_suscripcion: Inactivo`) ya manejados.
- `ProductCard.tsx` mobile-first, tamaño de tarjeta fijo sin importar la imagen.

### Fase 6 — Capa de Carrito y Checkout ✅ Hecho
- `hooks/useCart.ts`: estado local (localStorage), sumar/restar cantidades.
- `CartDrawer.tsx`: modal completo en mobile (`100dvh`), panel flotante en desktop; bloqueo de scroll de fondo mientras está abierto (`useBodyScrollLock`).
- `checkout-modal.tsx`: nombre, dirección, método de pago.

### Fase 7 — Capa de Integración WhatsApp ✅ Hecho
- `lib/whatsapp.ts`: formatea el mensaje con el detalle del pedido, usando `formatCOP` para los montos. **Sin emojis** — se usa `*texto*` (negrita nativa de WhatsApp).
- Genera `https://wa.me/{telefono_whatsapp}?text={mensaje_encoded}` y lo abre al confirmar el pedido — probado de punta a punta (agregar al carrito → checkout → mensaje real generado correctamente).

### Fase 8 — QA y Despliegue ⏸️ Pendiente de Supabase
- El flujo completo (dueño crea producto → cliente compra → mensaje a WhatsApp) ya está probado **con datos de ejemplo**.
- Falta repetirlo con datos reales de Supabase, validar RLS con dos tiendas reales, y el deploy a Vercel con variables de entorno de producción.

---

## 9. Modelo de negocio actualizado con la nueva estrategia comercial

### Modelo de Negocio (Referencia para post-MVP)

| Plan / Servicio | Costo | Productos | Stock | Descripción / Estado |
| --- | --- | --- | --- | --- |
| **Auditoría / Demo** | **$0 COP** | 3–5 de prueba | No | **El Gancho:** Demostración en vivo en 5 min para mostrarle al comerciante cómo se vería su catálogo. |
| **Promo Lanzamiento (Carga Asistida)** | **$30.000 – $50.000 COP** *(pago único)* | Hasta 20 productos | Sí | **Configuración Inicial:** El comerciante envía las fotos/precios por WhatsApp y tú se los dejas cargados + incluye el 1.er mes de servicio.

 |
| **Semilla (Gratis / Self-Service)** | **$0 COP** | Hasta 10 productos | No | **Autogestionado:** El dueño se registra y sube sus productos solo. Sin gestión automática de stock.

 |
| **Emprendedor (Suscripción)** | **~$25.000 – $30.000 COP/mes** | Hasta 100 productos | Sí | **Suscripción Recurrente:** Acceso completo al panel, autogestión de catálogo y control de stock.

 |
| **Empresa** | **~$60.000+ COP/mes** | Ilimitados | Sí + alertas | Backlog (para clientes con inventarios grandes o múltiples usuarios).

 |

---

####  Estrategia Comercial de Lanzamiento

* **Primera toma de contacto:** Auditoría/Demostración técnica de 5 minutos totalmente gratis.
* **Oferta de Entrada (Hook):** Paquete Promo de **$30.000 – $50.000 COP** donde el comerciante solo te pasa las fotos por chat y tú le entregas el catálogo montado con su primer mes activo.


* **Mantenimiento y Recurrencia:** A partir del mes 2, el cliente paga su mensualidad de **$25.000 – $30.000 COP** para mantener la tienda activa. Él mismo puede agregar/editar productos desde su panel. Si requiere cargues masivos asistidos nuevamente, se cobran como servicio adicional.


* **Clientes Iniciales:** 5 clientes semilla en municipios locales (Isnos, Pitalito) en nichos como ferreterías, ropa y depósitos de café.





## 10. Próximo Paso Inmediato

**Estado actual:** todo el frontend del MVP (Home, login UI, catálogo público, carrito, checkout, WhatsApp, dashboard) está construido y probado con datos de ejemplo (`localStorage`/`lib/mock-data.ts`). Lo único que falta para que sea 100% funcional es conectar Supabase de verdad:

1. **Fase 1:** crear el proyecto en Supabase, ejecutar `supabase/schema.sql`, crear el bucket `productos` en Storage.
2. **Fase 2/3:** cargar las credenciales reales en `.env.local` (usando `.env.local.example` como base) y verificar que `services/store.ts`/`services/products.ts` funcionen contra la base real; conectar el formulario de `/login`.
3. Reemplazar los hooks de mock (`useMockInventory`, `useMockTienda`, `getMockTiendaByCode`) por las Server Actions reales en `/dashboard` y `/store/[code]`.
4. **Fase 8:** QA end-to-end con datos reales y deploy a Vercel.

No se debe tocar nada de la sección "fuera del MVP" (sección 6) sin decisión explícita.
