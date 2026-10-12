Actúa como un Diseñador UI/UX Senior y Desarrollador Frontend experto en Tailwind CSS y React/Next.js.

Tu objetivo es rediseñar completamente la landing page existente de "CajaSimple para Windows" (https://vitrina-digital-prod.vercel.app/cajasimple) para convertirla en una web tipo SaaS moderna, limpia, de alto impacto visual y optimizada para la conversión.

A continuación tienes los requerimientos específicos de estructura, componentes y diseño que debes aplicar:

---

### 1. ESTILO VISUAL Y ESTÉTICA (SaaS Moderno)
- **Paleta de Colores y Fondos:** Utiliza un fondo principal ligero (`bg-slate-50` o `bg-zinc-900` si aplicas dark mode) para dar profundidad. Las tarjetas deben resaltar con `bg-white`, bordes finos `border border-slate-200/80` y sombras suaves (`shadow-sm hover:shadow-md transition-all duration-300`).
- **Tipografía y Jerarquía:** Usa un título principal grande (`text-4xl md:text-6xl font-extrabold`) con un gradiente sutil de texto (ej. de azul oscuro a azul eléctrico).
- **Consistencia:** Mantén una estética limpia y profesional, evitando bloques masivos de texto vertical.

---

### 2. ESTRUCTURA Y NAVEGACIÓN

#### A. Header / Sticky Navbar
- Crea una barra de navegación fija arriba (`sticky top-0 z-50 backdrop-blur-md bg-white/80`).
- Debe incluir:
  1. Logo/Nombre: "Vitrina Digital / CajaSimple".
  2. Menú de navegación rápida: Links anclados a `#caracteristicas`, `#como-funciona`, `#instalacion`, `#faq`.
  3. CTA directo a la derecha: Un botón compacto "Descargar para Windows" con el icono de Windows.

#### B. Hero Section (2 Columnas)
- **Columna Izquierda (Propuesta de valor):**
  - Badge superior: `Píldora interactiva "v0.1.2 · Actualizado en Septiembre"` que muestre un modal o tooltip con novedades al hacer clic.
  - Título potente enfocado en el beneficio principal: "El sistema de caja e inventario que funciona sin internet".
  - Subtítulo descriptivo y directo.
  - Botón primario prominente: "Descargar para Windows (v0.1.2)" con icono oficial de Windows.
  - Botón secundario: "Escribir a WhatsApp" (diseño discreto con icono de WhatsApp).
  - Puntos clave en fila con iconos/checkmarks: "Sin internet", "Datos locales", "Licencia flexible".
- **Columna Derecha (Mockup Flotante):**
  - Muestra la imagen de la interfaz dentro de una ventana estilizada de Windows (con la barra superior de la app, botones de minimizar, maximizar, cerrar, y efecto de sombra flotante `drop-shadow-2xl`).

#### C. Sección de Casos de Uso ("Ideal para...")
- Añade una sección corta en cuadrícula con iconos para identificar los negocios objetivo:
  - Misceláneas y Tiendas de barrio
  - Papelerías y Ferreterías
  - Tiendas de ropa y Comercio local

#### D. Galería Interactiva de Capturas (Tabs / Pestañas)
- Reemplaza la lista vertical de imágenes por un componente interactivo de Pestañas (Tabs):
  - Botones de pestañas: `[ Vender ] [ Inventario ] [ Cierre de Caja ] [ Etiquetas ]`.
  - Al cambiar de pestaña, muestra la imagen correspondiente dentro de un contenedor elegante con una descripción breve al lado o abajo.

#### E. Características (Bento Grid / Tarjetas en Cuadrícula)
- Convierte la lista actual de "Qué hace CajaSimple" en una cuadrícula de 3 columnas (Bento Grid):
  - Cada tarjeta debe incluir un icono minimalista (Lucide Icons), un título en negrita y 2 líneas de descripción.
  - Puntos a incluir: Venta rápida con escáner, Control de inventario y alertas, Cierre de caja en PDF, Impresión de etiquetas de código de barras, Copias de seguridad locales y Soporte integrado.

#### F. Instalación y SmartScreen (Acordeón Desplegable)
- Muestra el proceso de instalación en 4 pasos numerados y limpios.
- Para los avisos de seguridad de Windows SmartScreen, colócalos dentro de un componente de Acordeón o Collapsible (`▶ ¿Qué hacer si Windows muestra la pantalla azul?`). Esto evita sobrecargar la página con pantallazos gigantes a quienes no lo necesitan.

#### G. Licencia y Preguntas Frecuentes (FAQ)
- Presenta el bloque de licencias en una tarjeta destacada que explique claramente el periodo de prueba, la gracia de 15 días y la flexibilidad de traslado de PC.
- FAQ en formato de acordeón desplegable limpio, permitiendo al usuario expandir cada duda de forma ágil.

---

### 3. OUTPUT REQUERIDO
Genera el código completo estructurado (React + Tailwind CSS) aplicando este rediseño moderno, manteniendo todo el contenido informativo actual y mejorando la UX y la conversión.