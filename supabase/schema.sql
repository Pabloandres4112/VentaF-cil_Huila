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
-- de otros sistemas (ej. una app de inventario local de escritorio) desde la
-- misma base de datos, sin desplegar un proyecto/BD nueva por cada sistema.
-- Ver PLAN_EJECUCION.md, anexo "Sistema de Licencias".
-- =============================================================================

-- 3. Tabla de Superadministradores
-- Solo los user_id que estén aquí pueden ver o tocar /panel/licencias.
-- Se agregan manualmente desde el SQL Editor de Supabase (no hay UI para
-- esto a propósito: es una lista corta y sensible).
CREATE TABLE public.superadmins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Licencias
CREATE TABLE public.licencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  -- Identifica a qué sistema pertenece la licencia. Hoy solo existe
  -- 'inventario-local'; un sistema nuevo simplemente usa otro valor aquí,
  -- sin tocar la estructura de la tabla.
  producto TEXT NOT NULL DEFAULT 'inventario-local',
  cliente_nombre TEXT NOT NULL,
  -- Opcional: si el cliente de la licencia también es una tienda de
  -- VentaFácil, se puede enlazar aquí. No es obligatorio (los clientes del
  -- otro sistema no necesariamente tienen tienda en VentaFácil).
  tienda_id UUID REFERENCES public.tiendas(id) ON DELETE SET NULL,
  estado TEXT DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'Suspendido')),
  fecha_corte DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.superadmins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licencias ENABLE ROW LEVEL SECURITY;

-- Nadie puede leer ni modificar la lista de superadmins desde la app —
-- solo se administra manualmente desde el SQL Editor de Supabase.
CREATE POLICY "Nadie accede a superadmins desde la app" ON public.superadmins
  FOR ALL USING (false);

-- Solo un superadmin puede ver o modificar licencias directamente.
CREATE POLICY "Solo superadmin gestiona licencias" ON public.licencias
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.superadmins));

-- Función para que la OTRA app (el sistema de inventario local) valide un
-- código de licencia sin exponer la tabla completa. SECURITY DEFINER hace
-- que se ejecute saltando RLS, pero solo devuelve lo mínimo necesario.
-- Se llama desde afuera vía Supabase RPC: POST /rest/v1/rpc/validar_licencia
CREATE OR REPLACE FUNCTION public.validar_licencia(p_codigo TEXT)
RETURNS TABLE (estado TEXT, fecha_corte DATE, producto TEXT)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT estado, fecha_corte, producto
  FROM public.licencias
  WHERE codigo = upper(p_codigo);
$$;

REVOKE ALL ON FUNCTION public.validar_licencia(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validar_licencia(TEXT) TO anon, authenticated;
