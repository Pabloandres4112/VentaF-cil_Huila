# VentaF-cil_Huila


documentación inicial y el análisis profundo para que comiences a estructurar tu SaaS de Catálogo e Inventario para WhatsApp:

1. Definición del Producto (El "Qué")
Nombre sugerido: VentaFácil Huila (o algo que suene cercano a los negocios locales).
Propósito: Permitir que un pequeño comerciante cree un catálogo digital en 5 minutos para recibir pedidos organizados por WhatsApp, descontando automáticamente el inventario.

2. Análisis de Viabilidad (Lo que "no te cuadra")
Quizás lo que no te cuadra es el flujo del dinero o el mantenimiento. Vamos a despejarlo:

¿Cómo gana el cliente? Ahorra tiempo. Ya no tiene que explicar precios 20 veces al día por chat.

¿Cómo ganas tú? Cobras una suscripción mensual. Si el cliente no paga, el catálogo se desactiva automáticamente (esto se maneja fácil con Supabase).

¿Por qué no es costoso? Porque al usar Supabase y Vercel, el servidor solo "trabaja" cuando alguien entra al link. No tienes un servidor encendido 24/7 cobrándote dólares.

3. Información Requerida para Documentar (El "Cómo")
Para empezar a programar, necesitas definir estos 4 pilares:

A. Arquitectura de Datos (Base de Datos en Supabase)
Necesitas documentar al menos estas 3 tablas principales:

Negocios: ID, nombre, teléfono de WhatsApp (donde llegarán los pedidos), logo, plan (Gratis/Pro).

Productos: ID, ID_Negocio, nombre, precio, stock actual, imagen (URL), categoría.

Pedidos (Opcional): Para que el dueño pueda ver un historial de lo que ha vendido por la web.

B. El Stack Tecnológico (Costo $0)
Frontend: Next.js (TypeScript). Para el panel del dueño (donde sube fotos) y la vista del cliente (el catálogo).

Auth: Supabase Auth (para que los dueños entren a su panel con correo/contraseña).

Storage: Supabase Storage (para guardar las fotos de los productos).

Comunicación: Generador de enlaces wa.me (Lógica de JavaScript que concatena el número del dueño con el carrito de compras).

C. El Flujo del Usuario (UX)
El Dueño: Se registra -> Crea su tienda -> Sube sus productos -> Copia su link único (ej: ventafacil.com/tienda-pablo).

El Cliente: Entra al link -> Agrega al carrito -> Click en "Pedir por WhatsApp" -> Se abre su WhatsApp con el mensaje listo.






MVP
Para construir este **SaaS de Catálogo para WhatsApp**, el **MVP (Producto Mínimo Viable)** debe centrarse exclusivamente en la rapidez: que el comerciante suba sus productos y el cliente pueda comprar. Todo lo que no sea esencial para vender se deja para versiones futuras.

Aquí tienes la hoja de ruta completa para documentar y empezar a construir:

---

## 1. Definición del MVP (Funcionalidades Core)
El MVP se define como la versión con las funciones mínimas necesarias para que el producto sea utilizable por clientes reales y genere feedback.

*   **Para el Dueño del Negocio:**
    *   Registro e inicio de sesión (Auth).
    *   Creación de perfil de tienda (Nombre, WhatsApp, Logo).
    *   Panel de inventario: Crear, leer, actualizar y eliminar (CRUD) productos con foto, precio y stock.
    *   Generador de link único para compartir.
*   **Para el Cliente Final:**
    *   Vista de catálogo público.
    *   Carrito de compras local (sin necesidad de registro para el cliente).
    *   Botón de "Enviar pedido a WhatsApp" que genera el mensaje automático.

---

## 2. Roles del Sistema
Para que la arquitectura sea limpia, manejaremos dos roles principales:

1.  **Administrador del Comercio (Dueño):** Tiene acceso al panel de control (`/dashboard`). Puede gestionar sus propios productos y ver sus métricas básicas. No puede ver datos de otros comercios.
2.  **Cliente (Usuario Final):** Solo tiene acceso a la vista pública del catálogo (`/tienda/[nombre-tienda]`). No necesita cuenta; su experiencia es de navegación y compra.

---

## 3. Estructura de Planes y Paquetes
Manejaremos tres niveles para incentivar el salto a la suscripción paga:

| Característica | **Plan Semilla (Gratis)** | **Plan Emprendedor (Pago)** | **Plan Empresa (Pro)** |
| :--- | :--- | :--- | :--- |
| **Costo Mensual** | $0 COP | ~$29.900 COP | ~$59.900 COP |
| **Límite de Productos** | 10 productos | 100 productos | Ilimitados |
| **Gestión de Stock** | No (Solo catálogo) | Sí (Descuento automático) | Sí + Alertas de stock bajo |
| **Personalización** | Básica | Colores de marca | Dominio propio (opcional) |
| **Soporte** | Por documentación | Prioritario por WhatsApp | Dedicado |

---

## 4. Gestión Técnica de Planes (Lógica del SaaS)
¿Cómo sabe el sistema si alguien puede subir un producto o si su link debe estar activo?

*   **Control por Base de Datos:** En la tabla `perfiles_negocio` de Supabase, añadimos una columna llamada `plan_id` y otra `estado_suscripcion`.
*   **Restricción de Backend (RLS en Supabase):** Antes de insertar un producto, una función verifica: `COUNT(productos) WHERE negocio_id = X`. Si el conteo es mayor al límite del plan, el sistema devuelve un error 403.
*   **Middleware de Suscripción:** Si el `estado_suscripcion` es "Inactivo" (porque no pagó la mensualidad), el catálogo público muestra un mensaje de "Tienda temporalmente fuera de línea".



---

## 5. Arquitectura de Datos Sugerida (Tablas)
Para que empieces en Supabase hoy mismo, esta es la estructura mínima:

1.  **`tiendas`**: 
    *   `id` (uuid, PK)
    *   `owner_id` (uuid, FK a auth.users)
    *   `slug` (url única, ej: "el-estanco-de-juan")
    *   `whatsapp_phone` (string)
    *   `plan_tipo` (semilla/emprendedor/empresa)
2.  **`productos`**:
    *   `id` (uuid, PK)
    *   `tienda_id` (uuid, FK a tiendas)
    *   `nombre` (string)
    *   `precio` (numeric)
    *   `stock` (int4)
    *   `imagen_url` (text)

---


---

### 1. Arquitectura de VentaFácil (BaaS + Frontend Framework)
Para este SaaS, manejaremos una **Arquitectura Monorepo Simplificada** basada en **Next.js**. No usaremos un backend tradicional de Node.js/Express para ahorrar costos de servidor. En su lugar, usaremos **Supabase** como nuestro Backend-as-a-Service (BaaS).

*   **Frontend:** Next.js (App Router) para SSR (Server Side Rendering) y SEO.
*   **Base de Datos y Auth:** Supabase (PostgreSQL).
*   **Lógica de Negocio:** Manejada a través de **Server Actions** de Next.js (esto reemplaza la necesidad de tener un API aparte).

---

### 2. Estructura de Archivos Sugerida
Para que el proyecto sea profesional y fácil de mantener, organizaremos las carpetas de la siguiente manera:

```text
ventafacil-saas/
├── app/                  # Directorio principal de Next.js (App Router)
│   ├── (auth)/           # Rutas de login y registro
│   ├── (dashboard)/      # Panel administrativo del dueño del negocio
│   ├── (public)/         # Vista del catálogo para los clientes (tienda/[slug])
│   ├── api/              # Webhooks (ej. para pagos futuros con Wompi)
│   └── layout.tsx        # Layout global
├── components/           # Componentes reutilizables (UI)
│   ├── ui/               # Botones, inputs, tarjetas (estilo Shadcn/ui)
│   ├── shared/           # Navbar, Footer
│   └── store/            # Componentes específicos del catálogo
├── lib/                  # Utilidades y configuraciones
│   ├── supabase/         # Configuración del cliente de Supabase
│   └── utils.ts          # Funciones de ayuda (formato de moneda, etc.)
├── services/             # Lógica de comunicación con la DB (Server Actions)
│   ├── product.service.ts# CRUD de productos
│   └── shop.service.ts   # Configuración de la tienda
├── types/                # Definiciones de TypeScript (Interfaces)
├── supabase/             # Migraciones y esquema SQL de la base de datos
├── public/               # Imágenes estáticas y logos
└── next.config.js        # Configuración de Next.js
```

---

### 3. Distribución de Responsabilidades

| Parte | Tecnología | Función en VentaFácil |
| :--- | :--- | :--- |
| **Frontend** | **Next.js + Tailwind** | Renderiza el catálogo rápido para el cliente y el panel para el dueño. |
| **Backend (Lógica)** | **Next.js Server Actions** | Procesa la creación de productos y actualización de stock sin servidor externo. |
| **Persistencia** | **Supabase (PostgreSQL)** | Almacena productos, perfiles de tienda y configuraciones de planes. |
| **Archivos** | **Supabase Storage** | Guarda las fotos de los productos de forma gratuita. |
| **Integración WA** | **wa.me Links** | Genera el mensaje de compra automáticamente para evitar la API de Meta. |

---

### 4. ¿Por qué esta separación?
1.  **Costo $0:** Al no tener un servidor backend `Express` corriendo 24/7, Vercel te mantiene el sitio gratis. Supabase solo te cobra si pasas de miles de usuarios.
2.  **Velocidad de MVP:** Al tener todo en un solo lenguaje (**TypeScript**) y un solo framework (**Next.js**), puedes sacar la primera versión en una semana.
3.  **Seguridad:** Supabase maneja **RLS (Row Level Security)**, lo que asegura que el dueño de la "Tienda A" no pueda borrar productos de la "Tienda B" directamente desde la base de datos.



**¿Qué te parece esta estructura?** Si te gusta, podemos empezar a definir el primer **Service Action** (el de creación de producto) para que veas cómo se conecta con Supabase sin necesidad de Express.
