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

---

## 4. Estructura del Proyecto (definitiva)

```text
ventafacil/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx        # Login con Supabase Auth
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── page.tsx        # CRUD de productos
│   │       └── perfil/
│   │           └── page.tsx    # Configuración de tienda y WhatsApp
│   ├── tienda/
│   │   └── [slug]/
│   │       └── page.tsx        # Catálogo público para clientes
│   ├── layout.tsx
│   └── page.tsx                # Landing / Home básica
├── components/
│   ├── CartDrawer.tsx          # Carrito de compras flotante
│   ├── ProductCard.tsx         # Tarjeta de producto
│   └── ProductForm.tsx         # Modal/Formulario para crear/editar producto
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Cliente Supabase navegador
│   │   └── server.ts           # Cliente Supabase para Server Actions
│   └── whatsapp.ts             # Generador del enlace formateado wa.me
├── services/
│   ├── products.ts             # Server Actions de Productos
│   └── store.ts                # Server Actions de Tiendas
├── types/
│   └── index.ts                # Interfaces TypeScript (Tienda, Producto)
├── hooks/
│   └── useCart.ts              # Estado local del carrito (browser)
└── supabase/
    └── schema.sql              # Definición de tablas y políticas RLS
```

*(Esta estructura viene de `INSTRUCCIONES_PROYECTO.md`, que es la versión más concreta entre los 3 documentos; se usa como referencia única para evitar ambigüedad con las variantes de carpetas que aparecían en el README.)*

---

## 5. Modelo de Datos — Esquema SQL Definitivo (Supabase)

Este es el script exacto a ejecutar en el editor SQL de Supabase (fuente: `INSTRUCCIONES_PROYECTO.md`):

```sql
-- 1. Tabla de Tiendas (Perfiles de Comercio)
CREATE TABLE public.tiendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- Ej: 'tienda-pablo' -> /tienda/tienda-pablo
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

---

## 6. Alcance del MVP

### Incluido (Fase 1 del producto)

**Para el Dueño del Negocio:**
- Registro e inicio de sesión (Supabase Auth).
- Configuración de tienda: nombre, slug, número de WhatsApp.
- CRUD completo de productos (nombre, descripción, precio, stock, imagen, disponible on/off).
- Subida de imágenes a Supabase Storage (bucket `productos`).
- Link único de catálogo para compartir (`/tienda/[slug]`).

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
2. **Cliente Final:** solo accede a `/tienda/[slug]`, sin necesidad de cuenta, experiencia de navegación y compra.

---

## 8. Plan de Ejecución por Capas

El orden respeta dependencias técnicas: primero la infraestructura de datos, luego auth, luego lógica de servidor, luego UI admin, luego UI pública, y al final integración + despliegue.

### Fase 0 — Setup del Proyecto
- Crear proyecto Next.js 14+ con TypeScript y App Router.
- Configurar Tailwind CSS.
- Crear proyecto en Supabase (obtener `URL` y `ANON_KEY`).
- Configurar variables de entorno (`.env.local`).
- Conectar repositorio a Vercel (deploy inicial vacío para validar pipeline).

### Fase 1 — Capa de Datos (Supabase)
- Ejecutar el script SQL de la sección 5 (tablas `tiendas`, `productos` + RLS).
- Crear bucket `productos` en Supabase Storage con política de acceso pública de lectura.
- Verificar políticas RLS con pruebas manuales (un usuario no debe poder modificar datos de otra tienda).

### Fase 2 — Capa de Autenticación
- Implementar `lib/supabase/client.ts` y `lib/supabase/server.ts`.
- Página `(auth)/login` con Supabase Auth (email/contraseña).
- Middleware/verificación de sesión para proteger rutas `(dashboard)`.

### Fase 3 — Capa de Lógica de Servidor (Server Actions)
- `services/store.ts`: crear/leer/actualizar perfil de tienda (nombre, slug, teléfono WhatsApp).
- `services/products.ts`: CRUD completo de productos, incluyendo subida de imagen a Storage.
- `types/index.ts`: interfaces `Tienda` y `Producto`.

### Fase 4 — Capa de Panel Admin (`/dashboard`)
- Página de perfil: editar nombre de tienda, slug, número de WhatsApp.
- Página de inventario: listar, crear, editar, eliminar productos (`ProductForm.tsx`).
- Toggle de disponibilidad de producto.
- Mostrar el link único del catálogo para copiar/compartir.

### Fase 5 — Capa de Catálogo Público (`/tienda/[slug]`)
- Renderizar tienda + grid de productos disponibles (SSR con Next.js).
- Verificar `estado_suscripcion`; si es `Inactivo`, mostrar mensaje de tienda no disponible.
- `ProductCard.tsx` mobile-first.

### Fase 6 — Capa de Carrito y Checkout
- `hooks/useCart.ts`: estado local (localStorage), sumar/restar cantidades.
- `CartDrawer.tsx`: carrito flotante con badge contador y total.
- Modal de checkout: nombre, dirección, método de pago.

### Fase 7 — Capa de Integración WhatsApp
- `lib/whatsapp.ts`: formatear mensaje con el detalle del pedido (usar plantilla ya definida en `INSTRUCCIONES_PROYECTO.md`).
- Generar link `https://wa.me/{telefono_whatsapp}?text={mensaje_encoded}` y redirigir al confirmar pedido.

### Fase 8 — QA y Despliegue
- Pruebas end-to-end del flujo: dueño crea producto → cliente compra → mensaje llega correctamente formateado a WhatsApp.
- Validar RLS con dos tiendas de prueba distintas.
- Validar experiencia 100% mobile (dueño y cliente).
- Deploy final a Vercel con variables de entorno de producción.

---

## 9. Modelo de Negocio (referencia, no se construye en el MVP)

| Plan | Costo | Productos | Stock | Estado |
| :--- | :--- | :--- | :--- | :--- |
| Semilla (Gratis) | $0 | 10 | No | MVP puede usarse así manualmente |
| Emprendedor | ~$25.000–$30.000 COP/mes | 100 | Sí | Backlog |
| Empresa | ~$60.000+ COP/mes | Ilimitados | Sí + alertas | Backlog, sin definir |

- Instalación inicial: $150.000–$300.000 COP (manual, no automatizada).
- Estrategia de lanzamiento: 5 clientes semilla en Isnos y Pitalito (ferreterías, ropa, depósitos de café).
- La gestión de planes/límites (`plan_tipo`, conteo de productos vs. límite) queda documentada aquí para cuando el MVP esté validado — no se implementa ahora.

---

## 10. Próximo Paso Inmediato

Seguir estrictamente el orden de la sección 8. El siguiente paso a ejecutar es **Fase 0 — Setup del Proyecto**, seguido de **Fase 1** (ejecutar el SQL en Supabase).

No se debe avanzar a una fase sin completar la anterior, ni tocar nada de la sección "fuera del MVP" (sección 6) sin decisión explícita.
