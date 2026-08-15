# 🚀 INSTRUCCIONES DE DESARROLLO Y CONTEXTO TÉCNICO: VENTAFÁCIL (MVP)

Actúa como un Desarrollador Full-Stack Senior experto en Next.js, TypeScript y Supabase. Tu objetivo es construir el Producto Mínimo Viable (MVP) de **VentaFácil**, una plataforma de catálogos digitales para micronegocios locales que genera pedidos directos a WhatsApp.

---

## 📌 REGLAS DE ORO (ESTRICTAS)
1. **No agregar dependencias ni librerías pesadas extra** salvo las especificadas en este documento.
2. **No usar la API oficial de WhatsApp Business (Meta API)**. Todo el flujo de comunicación se realiza mediante enlaces esquemáticos dinámicos `wa.me`.
3. **No integrar pasarelas de pago automáticas** (Stripe, MercadoPago, etc.) para el MVP.
4. **Enfoque Mobile-First absoluto**: Toda la UI del catálogo público y del panel de administración debe ser 100% optimizada para pantallas móviles.
5. **Costo de infraestructura = $0**: El código debe usar Next.js Server Actions y Supabase (Free Tier) desplegable en Vercel.

---

## 🛠️ STACK TECNOLÓGICO

* **Framework:** Next.js 14+ (App Router) con TypeScript
* **Estilos:** Tailwind CSS + Lucide Icons (o similar liviano)
* **Backend:** Next.js Server Actions
* **Base de datos & Auth:** Supabase (PostgreSQL + Supabase Auth + Supabase Storage)
* **Despliegue:** Vercel

---

## 🗄️ ESQUEMA DE BASE DE DATOS (SQL PARA SUPABASE)

Ejecutar el siguiente script en el Editor SQL de Supabase:

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



  📂 ESTRUCTURA DEL PROYECTO

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
└── services/
    ├── products.ts             # Server Actions de Productos
    └── store.ts                # Server Actions de Tiendas




    __
    ⚙️ REQUERIMIENTOS FUNCIONALES DETALLADOS
1. Catálogo Público (/tienda/[slug])
Verificar estado_suscripcion. Si es 'Inactivo', mostrar mensaje: "Tienda no disponible temporalmente".

Renderizar lista/grid de productos activos.

Carrito en Cliente (LocalStorage / React State):

Permitir sumar/restar cantidades.

Botón flotante del carrito con badge contador e importe total.

Modal de Finalización de Pedido:

Campos: Nombre del Cliente, Dirección de Entrega, Método de Pago (Nequi, Daviplata, Efectivo).

Generación de Mensaje de WhatsApp:

Al confirmar, usar la función lib/whatsapp.ts y redirigir a https://wa.me/{telefono_whatsapp}?text={mensaje_encoded}.



🛒 *¡Nuevo Pedido desde VentaFácil!*

👤 *Cliente:* [Nombre]
📍 *Dirección:* [Dirección]
💳 *Pago:* [Método]

*Detalle del pedido:*
• [Cantidad]x [Nombre Producto] ($[Subtotal])

💰 *Total a pagar:* $[Total]

_Enviado desde el catálogo digital._


2. Panel de Administración (/dashboard)
Autenticación básica con email y contraseña mediante supabase.auth.

Modificar número de WhatsApp de recepción de pedidos.

CRUD completo de productos:

Crear producto (con subida de imagen a Supabase Storage bucket productos).

Editar precio, stock, descripción y conmutador disponible (ON/OFF).

Eliminar producto.