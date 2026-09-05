-- Esquema definitivo del MVP — ver sección 5 de PLAN_EJECUCION.md
-- Ejecutar en el Editor SQL de Supabase (Fase 1).

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
  -- Personalización de marca: lo único que el dueño puede personalizar
  -- aparte del nombre. NULL = usa los colores por defecto de globals.css.
  -- Nunca controla el verde de WhatsApp, que queda fijo en toda la app.
  color_primario TEXT,
  color_secundario TEXT,
  color_fondo TEXT,
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

-- =============================================================================
-- SISTEMA DE LICENCIAS (multi-producto) — NO es parte del MVP de VentaFácil,
-- es un panel aparte para que el operador de VentaFácil administre licencias
-- de otros sistemas (hoy: CajaSimple, un POS/inventario de escritorio
-- Tauri+SQLite, local-only) desde la misma base de datos, sin desplegar un
-- proyecto/BD nueva por cada sistema. Ver PLAN_EJECUCION.md, anexo
-- "Sistema de Licencias".
--
-- Si ya habías ejecutado una versión anterior de este bloque (con columnas
-- `codigo`/`fecha_corte`), primero corre esto para dejarlo limpio (no toca
-- tiendas/productos/superadmins):
--   DROP FUNCTION IF EXISTS public.validar_licencia(TEXT);
--   DROP TABLE IF EXISTS public.licencias;
-- =============================================================================

-- 3. Tabla de Superadministradores
-- Solo los user_id que estén aquí pueden ver o tocar /admin/licencias.
-- Se agregan manualmente desde el SQL Editor de Supabase (no hay UI para
-- esto a propósito: es una lista corta y sensible).
CREATE TABLE public.superadmins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Licencias
-- `estado` aquí solo guarda lo que el admin controla manualmente (ACTIVA /
-- DESHABILITADA). Estados derivados como vencida, código inválido o
-- hardware que no coincide se calculan en el endpoint de validación
-- (app/api/v1/licencias/validar/route.ts), no se guardan en la columna.
CREATE TABLE public.licencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  licencia_key TEXT UNIQUE NOT NULL DEFAULT 'CAJA-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  -- Identifica a qué sistema pertenece la licencia. Hoy solo existe
  -- 'cajasimple'; un sistema nuevo simplemente usa otro valor aquí, sin
  -- tocar la estructura de la tabla.
  producto TEXT NOT NULL DEFAULT 'cajasimple',
  -- NULL hasta la primera validación exitosa (primera activación). Una vez
  -- fijado, el endpoint rechaza validaciones desde otro hardware_id.
  hardware_id TEXT,
  cliente_nombre TEXT NOT NULL,
  -- Opcional: si el cliente de la licencia también es una tienda de
  -- VentaFácil, se puede enlazar aquí. No es obligatorio (los clientes de
  -- CajaSimple no necesariamente tienen tienda en VentaFácil).
  tienda_id UUID REFERENCES public.tiendas(id) ON DELETE SET NULL,
  estado TEXT NOT NULL DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'DESHABILITADA')),
  fecha_vencimiento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.superadmins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licencias ENABLE ROW LEVEL SECURITY;

-- Nadie puede leer ni modificar la lista de superadmins desde la app —
-- solo se administra manualmente desde el SQL Editor de Supabase.
CREATE POLICY "Nadie accede a superadmins desde la app" ON public.superadmins
  FOR ALL USING (false);

-- Nadie accede a licencias directamente vía la API pública de Supabase —
-- el panel admin y el endpoint de validación usan la service role key
-- (ver lib/supabase/service.ts), que salta RLS a propósito. La
-- autorización la hacen esas dos capas (isSuperadmin() y el secreto
-- compartido de CajaSimple), no RLS — porque ninguna de las dos tiene una
-- sesión de usuario de Supabase Auth detrás.
CREATE POLICY "Bloqueado por RLS — solo service role" ON public.licencias
  FOR ALL USING (false);

-- =============================================================================
-- PERMISOS DE TABLA (independientes de RLS)
--
-- Con "Automatically expose new tables" desactivado al crear el proyecto
-- (recomendado — control explícito en vez de exponer todo por defecto),
-- Supabase NO le da automáticamente privilegios sobre tablas nuevas a los
-- roles anon/authenticated/service_role. RLS solo decide QUÉ FILAS puede
-- ver un rol que YA tiene permiso — sin este GRANT, ni siquiera llega a
-- evaluarse la política, falla antes con "permission denied".
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- tiendas/productos: los usa el navegador (anon) y el dueño logueado
-- (authenticated) — RLS de arriba sigue siendo la barrera real.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tiendas TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.productos TO anon, authenticated, service_role;

-- superadmins/licencias: solo los toca el servidor con la service role key.
GRANT SELECT ON public.superadmins TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.licencias TO service_role;

-- =============================================================================
-- MIGRACIÓN — Personalización de marca (colores de tienda)
--
-- Si tu proyecto ya existía antes de este cambio (como el de QA), la tabla
-- `tiendas` ya está creada y el CREATE TABLE de arriba no vuelve a correr.
-- Ejecuta solo este bloque en el SQL Editor de Supabase:
-- =============================================================================

ALTER TABLE public.tiendas ADD COLUMN IF NOT EXISTS color_primario TEXT;
ALTER TABLE public.tiendas ADD COLUMN IF NOT EXISTS color_secundario TEXT;
ALTER TABLE public.tiendas ADD COLUMN IF NOT EXISTS color_fondo TEXT;
