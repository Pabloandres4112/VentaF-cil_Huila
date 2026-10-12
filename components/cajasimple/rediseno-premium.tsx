"use client";

// SEGUNDO intento de rediseño de /cajasimple, estilo "premium y minimalista"
// (ver rediseño_CajaSimple.md, versión actual del documento). Reemplaza al
// primer intento (components/cajasimple/rediseno.tsx, estilo SaaS con
// gradientes) sin borrarlo, por si Pablo prefiere volver a él.
//
// Todo en un solo archivo a propósito, igual que el primer intento: es un
// experimento visual, fácil de borrar si no gusta. El CONTENIDO (textos de
// funciones, capturas, preguntas) se reutiliza tal cual de secciones.tsx —
// este archivo solo cambia la presentación (paleta, tipografía, estructura
// de secciones), no inventa funciones, cifras ni compatibilidades nuevas.
//
// Paleta y tipografía quedan aplicadas SOLO dentro de <TemaPremium>, vía
// variables CSS en el elemento raíz — no tocan los tokens globales
// (app/globals.css) que usa el resto del sitio (catálogo, dashboard, etc.).
// El verde de WhatsApp (--wa*) se deja fijo a propósito, como en todo el
// resto de la app.

import { Manrope, Inter } from "next/font/google";
import {
  Boxes,
  ChevronDown,
  Download,
  HardDrive,
  Menu,
  ShieldCheck,
  WifiOff,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { WhatsappIcon } from "@/components/icons";
import { VitrinaMark } from "@/components/vitrina-mark";
import {
  CAPTURAS,
  FUNCIONES,
  IMAGENES_PANTALLA_AZUL,
  PREGUNTAS,
} from "@/components/cajasimple/secciones";
import { useModalA11y } from "@/hooks/useModalA11y";
import type { BloqueNovedades } from "@/lib/cajasimple";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const PALETA = {
  "--ground": "#F7F6F2",
  "--surface": "#FFFFFF",
  "--surface-2": "#E4E9E3",
  "--ink": "#202824",
  "--ink-soft": "#495750",
  "--ink-faint": "#5A6B64",
  "--line": "#20282420",
  "--line-strong": "#20282435",
  "--accent": "#173C35",
  "--accent-ink": "#FFFFFF",
  "--accent-soft": "#E4E9E3",
} as const;

// Animación de entrada, solo para el encabezado (sección 2 del documento: "la
// sección más importante de la web") — el propio documento pide evitar
// "animaciones de entrada en todos los elementos" (sección 10) y que sean
// "breves y opcionales cuando corresponda" (sección 12). Respeta
// prefers-reduced-motion: quien prefiere menos movimiento ve todo quieto y
// visible de una vez, sin que nada quede a medio aparecer.
const ESTILOS_ANIMACION = `
  @keyframes csp-fade-up {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .csp-fade-up {
    opacity: 0;
    animation: csp-fade-up 0.6s ease-out both;
  }
  .csp-delay-1 { animation-delay: 0.08s; }
  .csp-delay-2 { animation-delay: 0.16s; }
  .csp-delay-3 { animation-delay: 0.24s; }
  .csp-delay-4 { animation-delay: 0.32s; }
  @media (prefers-reduced-motion: reduce) {
    .csp-fade-up { animation: none; opacity: 1; transform: none; }
  }
`;

export function TemaPremium({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${manrope.variable} ${inter.variable} bg-ground text-ink`}
      style={{ ...PALETA, fontFamily: "var(--font-inter)" } as React.CSSProperties}
    >
      <style>{ESTILOS_ANIMACION}</style>
      {children}
    </div>
  );
}

function Titulo({
  as: Tag = "h2",
  id,
  className = "",
  children,
}: {
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag id={id} className={className} style={{ fontFamily: "var(--font-manrope)" }}>
      {children}
    </Tag>
  );
}

// ------------------------------------------------------------------- Navbar

const ENLACES_NAV = [
  { href: "#producto", texto: "Funciones" },
  { href: "#capturas", texto: "Capturas" },
  { href: "#faq", texto: "Preguntas" },
];

export function NavbarPremium({ descargaUrl }: { descargaUrl: string | null }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-300 items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex flex-none items-center gap-2">
          <VitrinaMark size={24} />
          <Titulo as="h1" className="text-base">
            CajaSimple
          </Titulo>
        </Link>

        <nav aria-label="Secciones de la página" className="hidden items-center gap-7 md:flex">
          {ENLACES_NAV.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              className="text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {enlace.texto}
            </a>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-2">
          {descargaUrl && (
            <a
              href={descargaUrl}
              download
              rel="noopener"
              className="hidden items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-ink transition-opacity hover:opacity-90 sm:inline-flex"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Descargar
            </a>
          )}
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-ink md:hidden"
          >
            {abierto ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav
          aria-label="Secciones de la página"
          className="flex flex-col gap-1 border-t border-line px-5 py-3 md:hidden"
        >
          {ENLACES_NAV.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              onClick={() => setAbierto(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-semibold text-ink-soft hover:bg-surface-2 hover:text-ink"
            >
              {enlace.texto}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

// --------------------------------------------------------------------- Hero

function MarcoCaptura({
  src,
  alt,
  onAmpliar,
}: {
  src: string;
  alt: string;
  onAmpliar?: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
      <Image src={src} alt={alt} width={1600} height={1000} className="h-auto w-full" priority />
      {onAmpliar && (
        <button
          type="button"
          onClick={onAmpliar}
          aria-label="Ampliar imagen"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm transition-colors hover:bg-surface"
        >
          <ZoomIn aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function HeroPremium({
  version,
  descargaUrl,
}: {
  version: string | null;
  descargaUrl: string | null;
}) {
  return (
    <section className="mx-auto max-w-300 px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="csp-fade-up mb-5 inline-flex items-center rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
            Software de caja para Windows
          </span>

          <Titulo
            as="h1"
            className="csp-fade-up csp-delay-1 mb-5 text-4xl leading-[1.08] text-ink sm:text-5xl md:text-[3.4rem]"
          >
            Tu negocio bajo control. Sin depender de internet.
          </Titulo>

          <p className="csp-fade-up csp-delay-2 mb-8 max-w-md text-lg text-ink-soft">
            Vende, controla tu inventario y revisa el cierre del día desde un solo programa,
            instalado en tu computador.
          </p>

          <div className="csp-fade-up csp-delay-3 flex flex-col gap-3 sm:flex-row">
            {descargaUrl && (
              <a
                href={descargaUrl}
                download
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-base font-bold text-accent-ink transition-opacity hover:opacity-90"
              >
                <Download aria-hidden="true" className="h-5 w-5" />
                Descargar para Windows{version ? ` (v${version})` : ""}
              </a>
            )}
            <a
              href="#capturas"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong px-6 py-4 text-base font-bold text-ink transition-colors hover:bg-surface-2"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>

        <div className="csp-fade-up csp-delay-4">
          <MarcoCaptura src={CAPTURAS[0].src} alt={CAPTURAS[0].alt} />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------- Beneficios principales

const BENEFICIOS = [
  {
    icono: WifiOff,
    titulo: "Funciona sin internet",
    texto: "Vende, consulta tu inventario y cierra la caja sin conexión. Solo necesitas internet para activar tu licencia (una vez) y para actualizar.",
  },
  {
    icono: Boxes,
    titulo: "Ventas e inventario en un solo lugar",
    texto: "Registra tus productos, controla sus existencias y cobra tus ventas desde el mismo programa, sin cambiar entre herramientas.",
  },
  {
    icono: HardDrive,
    titulo: "Tus datos quedan en tu computador",
    texto: "La información no se sube a internet. Tú decides cuándo hacer una copia de seguridad, en una USB o en la nube.",
  },
];

export function BeneficiosPrincipales() {
  return (
    <section aria-labelledby="beneficios-titulo" className="mx-auto max-w-300 px-5 py-14 sm:px-8">
      <ul className="grid gap-5 sm:grid-cols-3">
        {BENEFICIOS.map(({ icono: Icono, titulo, texto }) => (
          <li key={titulo} className="rounded-2xl border border-line bg-surface p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icono aria-hidden="true" className="h-5 w-5" />
            </span>
            <Titulo as="h3" className="mb-2 text-base text-ink">
              {titulo}
            </Titulo>
            <p className="text-sm text-ink-soft">{texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ------------------------------------------------------- El producto en acción

function Lightbox({ captura, onClose }: { captura: (typeof CAPTURAS)[number]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useModalA11y(ref, true, onClose);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={captura.titulo}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative w-full max-w-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
        <Image
          src={captura.src}
          alt={captura.alt}
          width={1600}
          height={1000}
          className="h-auto w-full rounded-xl"
        />
        <p className="mt-3 text-center text-sm font-semibold text-surface">{captura.titulo}</p>
      </div>
    </div>
  );
}

export function ProductoEnAccion() {
  const [activa, setActiva] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const actual = CAPTURAS[activa];
  const descripcion = FUNCIONES[Math.min(activa, FUNCIONES.length - 1)].texto;

  return (
    <section id="capturas" aria-labelledby="capturas-titulo" className="scroll-mt-20 bg-surface-2 py-16">
      <div className="mx-auto max-w-300 px-5 sm:px-8">
        <Titulo as="h2" id="capturas-titulo" className="mb-2 text-center text-2xl sm:text-3xl">
          El producto en acción
        </Titulo>
        <p className="mx-auto mb-8 max-w-lg text-center text-sm text-ink-soft">
          Capturas reales del programa, no ilustraciones genéricas.
        </p>

        <div
          role="tablist"
          aria-label="Capturas de CajaSimple"
          className="mb-6 flex flex-wrap justify-center gap-2"
        >
          {CAPTURAS.map((captura, i) => (
            <button
              key={captura.src}
              type="button"
              role="tab"
              id={`tab-${i}`}
              aria-selected={activa === i}
              aria-controls={`panel-${i}`}
              onClick={() => setActiva(i)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                activa === i ? "bg-accent text-accent-ink" : "bg-surface text-ink-soft hover:bg-ink/5"
              }`}
            >
              {captura.titulo}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${activa}`} aria-labelledby={`tab-${activa}`} className="mx-auto max-w-3xl">
          <MarcoCaptura src={actual.src} alt={actual.alt} onAmpliar={() => setAmpliada(true)} />
          <p className="mt-4 text-center text-sm text-ink-soft">{descripcion}</p>
        </div>
      </div>

      {ampliada && <Lightbox captura={actual} onClose={() => setAmpliada(false)} />}
    </section>
  );
}

// ------------------------------------------------------ Funciones por categoría

const CATEGORIAS = [
  {
    titulo: "Ventas y cobros",
    items: [FUNCIONES[0]], // Vende rápido
  },
  {
    titulo: "Productos e inventario",
    items: [FUNCIONES[1], FUNCIONES[3]], // Controla tu inventario, Etiquetas
  },
  {
    titulo: "Caja e informes",
    items: [FUNCIONES[2]], // Cierra la caja
  },
  {
    titulo: "Seguridad y configuración",
    items: [FUNCIONES[4], FUNCIONES[5]], // Copias de seguridad, Ayuda
  },
];

export function FuncionesPorCategoria() {
  return (
    <section id="producto" aria-labelledby="producto-titulo" className="scroll-mt-20 mx-auto max-w-300 px-5 py-16 sm:px-8">
      <Titulo as="h2" id="producto-titulo" className="mb-10 text-center text-2xl sm:text-3xl">
        Qué hace CajaSimple
      </Titulo>
      <div className="grid gap-6 sm:grid-cols-2">
        {CATEGORIAS.map((categoria) => (
          <div key={categoria.titulo} className="rounded-2xl border border-line bg-surface p-6">
            <Titulo as="h3" className="mb-4 text-lg text-ink">
              {categoria.titulo}
            </Titulo>
            <ul className="flex flex-col gap-4">
              {categoria.items.map(({ icono: Icono, titulo, texto }) => (
                <li key={titulo} className="flex gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icono aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{titulo}</p>
                    <p className="text-sm text-ink-soft">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Cómo empezar

export function ComoEmpezar() {
  return (
    <section
      id="instalacion"
      aria-labelledby="instalacion-titulo"
      className="scroll-mt-20 bg-surface-2 py-16"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Titulo as="h2" id="instalacion-titulo" className="mb-10 text-center text-2xl sm:text-3xl">
          Cómo empezar
        </Titulo>

        <ol className="mb-6 flex flex-col gap-5">
          <PasoEmpezar numero={1} titulo="Descargar">
            Pulsa «Descargar para Windows». Se guarda un archivo que termina en «-setup.exe».
          </PasoEmpezar>

          <PasoEmpezar numero={2} titulo="Instalar">
            Abre el archivo descargado y sigue el asistente, que sale en español: «Siguiente»,
            «Instalar» y «Finalizar».
            <details className="group mt-3 rounded-xl border border-line bg-surface">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                ¿Qué hago si Windows muestra una advertencia?
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 flex-none text-ink-soft transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="flex flex-col gap-4 px-4 pb-4 text-sm text-ink-soft">
                <p>
                  El instalador todavía no tiene certificado de firma de Microsoft, así que Windows
                  puede mostrar una pantalla azul («Windows protegió su PC»). Haz esto solo si
                  descargaste el archivo desde esta página: pulsa «Más información» y luego «Ejecutar
                  de todas formas».
                </p>
                {IMAGENES_PANTALLA_AZUL.map((imagen) => (
                  <figure key={imagen.src} className="flex flex-col gap-2">
                    <figcaption className="font-semibold text-ink">{imagen.titulo}</figcaption>
                    <Image
                      src={imagen.src}
                      alt={imagen.alt}
                      width={imagen.ancho}
                      height={imagen.alto}
                      className="h-auto w-full max-w-sm rounded-lg border border-line"
                    />
                  </figure>
                ))}
                <p>
                  Tu navegador también puede decir que el archivo «no se descarga habitualmente».
                  Pulsa «Conservar» y, si vuelve a preguntar, «Mostrar más» y luego «Conservar de
                  todos modos».
                </p>
              </div>
            </details>
          </PasoEmpezar>

          <PasoEmpezar numero={3} titulo="Configurar">
            Abre CajaSimple desde el menú Inicio, acepta los términos y activa el programa con la
            clave que te enviamos. Luego crea tus productos, imprime etiquetas si las necesitas, y ya
            puedes vender y cerrar la caja al final del día.
          </PasoEmpezar>
        </ol>
      </div>
    </section>
  );
}

function PasoEmpezar({ numero, titulo, children }: { numero: number; titulo: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink"
      >
        {numero}
      </span>
      <div className="min-w-0 text-sm text-ink-soft">
        <Titulo as="h3" className="text-base text-ink">
          {titulo}
        </Titulo>
        <div className="mt-1">{children}</div>
      </div>
    </li>
  );
}

// ------------------------------------------------- Seguridad y compatibilidad

export function SeguridadYCompatibilidad() {
  return (
    <section
      aria-labelledby="seguridad-titulo"
      className="mx-auto max-w-300 px-5 py-16 sm:px-8"
    >
      <Titulo as="h2" id="seguridad-titulo" className="mb-10 text-center text-2xl sm:text-3xl">
        Seguridad y compatibilidad
      </Titulo>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <Titulo as="h3" className="mb-3 text-base text-ink">
            Requisitos
          </Titulo>
          <ul className="flex flex-col gap-2 pl-5 text-sm text-ink-soft" style={{ listStyleType: "disc" }}>
            <li>Windows 10 u 11, de 64 bits. No funciona en Mac ni en celulares.</li>
            <li>4 GB de RAM recomendados.</li>
            <li>Unos 200 MB libres (el programa ocupa mucho menos; el resto es para tus datos).</li>
            <li>Lector de códigos de barras USB (opcional) e impresora normal para etiquetas (opcional).</li>
          </ul>
          <p className="mt-3 text-xs text-ink-faint">
            En algunos Windows 10 antiguos, el instalador descarga un componente de Microsoft
            (WebView2); ahí sí hace falta internet durante la instalación.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-accent" />
            <Titulo as="h3" className="text-base text-ink">
              Sobre la firma digital
            </Titulo>
          </div>
          <p className="mb-3 text-sm text-ink-soft">
            El instalador todavía no tiene certificado de firma de Microsoft. Por eso Windows puede
            mostrar una advertencia al abrirlo. Descárgalo solo desde esta página.
          </p>
          <p className="mb-3 text-sm text-ink-soft">
            CajaSimple es un programa de control interno de tu negocio: no emite factura electrónica
            ni reemplaza a tu contador, y todavía no imprime tickets ni recibos térmicos.
          </p>
          <p className="text-sm text-ink-soft">
            Tus datos se guardan en tu computador. Puedes exportarlos a Excel (CSV) o JSON, y hacer
            una copia de seguridad en una USB o en la nube cuando quieras.
          </p>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------------ FAQ

// Preguntas de secciones.tsx (ya aprobadas) + las que pide el documento de
// rediseño y todavía no eran una pregunta propia (compatibilidad, copias de
// seguridad, impresoras/lectores, tickets térmicos, versión de prueba,
// ayuda). Ninguna respuesta inventa datos: reutiliza lo ya dicho en la página.
const PREGUNTAS_EXTRA = [
  {
    pregunta: "¿Qué versiones de Windows son compatibles?",
    respuesta: "Windows 10 u 11, de 64 bits. No funciona en Mac ni en celulares.",
  },
  {
    pregunta: "¿Cómo hago una copia de seguridad?",
    respuesta: "Desde el programa puedes guardar todo en un archivo, en una USB o en la nube.",
  },
  {
    pregunta: "¿Cómo restauro una copia?",
    respuesta: "Desde esa misma opción de copias de seguridad, eliges el archivo guardado y lo restauras.",
  },
  {
    pregunta: "¿Admite impresoras o lectores de código de barras?",
    respuesta:
      "El lector de códigos de barras es opcional: sirve cualquier lector USB que funcione como teclado. La impresora también es opcional, y una impresora normal sirve para las hojas de etiquetas.",
  },
  {
    pregunta: "¿Imprime tickets térmicos?",
    respuesta: "Todavía no imprime tickets ni recibos térmicos.",
  },
  {
    pregunta: "¿Qué incluye la versión de prueba?",
    respuesta:
      "La versión de prueba te deja usar CajaSimple con límites, sin necesidad de licencia. Para usarlo sin límites necesitas una licencia.",
  },
  {
    pregunta: "¿Cómo obtengo ayuda?",
    respuesta: "Escríbenos por WhatsApp con el botón que aparece más abajo en esta página.",
  },
];

const TODAS_LAS_PREGUNTAS = [...PREGUNTAS, ...PREGUNTAS_EXTRA];

export function FaqPremium() {
  return (
    <section id="faq" aria-labelledby="faq-titulo" className="scroll-mt-20 mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <Titulo as="h2" id="faq-titulo" className="mb-10 text-center text-2xl sm:text-3xl">
        Preguntas frecuentes
      </Titulo>
      <div className="flex flex-col gap-3">
        {TODAS_LAS_PREGUNTAS.map(({ pregunta, respuesta }) => (
          <details key={pregunta} name="faq-cajasimple-premium" className="group rounded-2xl border border-line bg-surface">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {pregunta}
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 flex-none text-ink-soft transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="px-5 pb-4 text-sm text-ink-soft">{respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------- CTA final

export function CtaFinal({
  version,
  fechaFormateada,
  novedades,
  descargaUrl,
}: {
  version: string | null;
  fechaFormateada: string | null;
  novedades: BloqueNovedades[];
  descargaUrl: string | null;
}) {
  return (
    <section className="bg-accent py-16">
      <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
        <Titulo as="h2" className="mb-3 text-2xl text-accent-ink sm:text-3xl">
          Organiza las operaciones de tu negocio con CajaSimple.
        </Titulo>
        {descargaUrl && (
          <a
            href={descargaUrl}
            download
            rel="noopener"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-surface px-6 py-4 text-base font-bold text-accent transition-opacity hover:opacity-90"
          >
            <Download aria-hidden="true" className="h-5 w-5" />
            Descargar CajaSimple para Windows
          </a>
        )}
        {version && (
          <p className="mt-4 text-sm text-accent-ink/80">
            Versión {version}
            {fechaFormateada && <> · publicada el {fechaFormateada}</>} · tamaño aproximado: 3 MB
          </p>
        )}
        {novedades.length > 0 && (
          <div className="mx-auto mt-5 max-w-md rounded-xl bg-white/10 p-4 text-left text-sm text-accent-ink">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-accent-ink/70">
              Novedades de esta versión
            </p>
            <div className="flex flex-col gap-1.5">
              {novedades.map((bloque, i) =>
                bloque.tipo === "lista" ? (
                  <ul key={i} className="flex flex-col gap-1 pl-4" style={{ listStyleType: "disc" }}>
                    {bloque.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{bloque.texto}</p>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------- Sin descarga

export function SinDescarga({ whatsappHref }: { whatsappHref: string | null }) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8">
      <p className="mb-4 text-sm text-ink-soft">
        La descarga no está disponible en este momento. Escríbenos por WhatsApp y te la enviamos.
      </p>
      {whatsappHref && <BotonWhatsapp href={whatsappHref} texto="Escríbenos por WhatsApp" />}
    </section>
  );
}

// -------------------------------------------------------------------- Footer

export function FooterPremium({ whatsappAyuda }: { whatsappAyuda: string | null }) {
  return (
    <footer className="border-t border-line bg-surface py-10">
      <div className="mx-auto max-w-300 px-5 sm:px-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <VitrinaMark size={22} />
            <span className="text-sm font-bold text-ink">CajaSimple · Vitrina Digital</span>
          </div>
          {whatsappAyuda && <BotonWhatsapp href={whatsappAyuda} texto="Escríbenos por WhatsApp" />}
        </div>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 text-sm text-ink-soft">
          <Link href="/terminos" className="underline underline-offset-2 hover:text-ink">
            Términos y Condiciones
          </Link>
          <Link href="/privacidad" className="underline underline-offset-2 hover:text-ink">
            Política de privacidad
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export function BotonWhatsapp({ href, texto }: { href: string; texto: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-wa px-5 py-3 text-sm font-bold text-wa-ink transition-colors hover:bg-wa/90"
    >
      <WhatsappIcon width={18} height={18} />
      {texto}
    </a>
  );
}
