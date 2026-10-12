"use client";

// Rediseño de prueba de /cajasimple en estilo SaaS moderno (rediseño_CajaSimple.md).
// Todo en un solo archivo a propósito: es un experimento visual para que Pablo
// decida si le gusta o no — si no, se borra este archivo y el import en la
// página, sin dejar rastros repartidos por el proyecto.
//
// El CONTENIDO (textos de funciones, capturas, preguntas) se reutiliza tal
// cual de components/cajasimple/secciones.tsx — este archivo solo cambia la
// presentación, no inventa funciones ni datos nuevos.

import {
  ChevronDown,
  Download,
  Hammer,
  Menu,
  Shirt,
  Store,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WhatsappIcon } from "@/components/icons";
import { VitrinaMark } from "@/components/vitrina-mark";
import {
  CAPTURAS,
  FUNCIONES,
  IMAGENES_PANTALLA_AZUL,
  Lista,
} from "@/components/cajasimple/secciones";
import type { BloqueNovedades } from "@/lib/cajasimple";

// ------------------------------------------------------------------- Navbar

const ENLACES_NAV = [
  { href: "#caracteristicas", texto: "Características" },
  { href: "#como-funciona", texto: "Cómo funciona" },
  { href: "#instalacion", texto: "Instalación" },
  { href: "#faq", texto: "Preguntas" },
];

export function NavbarRediseno({ descargaUrl }: { descargaUrl: string | null }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex flex-none items-center gap-2">
          <VitrinaMark size={24} />
          <span className="font-display text-sm sm:text-base">
            Vitrina Digital <span className="text-ink-faint">/</span> CajaSimple
          </span>
        </Link>

        <nav aria-label="Secciones de la página" className="hidden items-center gap-6 md:flex">
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
              className="hidden items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 sm:inline-flex"
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
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line-strong text-ink md:hidden"
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
              className="rounded-md px-2 py-2.5 text-sm font-semibold text-ink-soft hover:bg-ink/5 hover:text-ink"
            >
              {enlace.texto}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

// --------------------------------------------------------- Píldora de versión

export function PildoraVersion({
  version,
  fechaFormateada,
  novedades,
}: {
  version: string;
  fechaFormateada: string | null;
  novedades: BloqueNovedades[];
}) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    function fuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, [abierto]);

  if (novedades.length === 0) {
    return (
      <span className="inline-flex w-fit items-center rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-semibold text-ink-soft">
        v{version}
      </span>
    );
  }

  return (
    <div ref={contenedorRef} className="relative w-fit">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent"
      >
        v{version}
        {fechaFormateada && <span className="text-ink-faint">· Actualizado {fechaFormateada}</span>}
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform ${abierto ? "rotate-180" : ""}`}
        />
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label={`Novedades de la versión ${version}`}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-10 w-72 rounded-xl border border-line bg-surface p-4 text-left shadow-lg"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
            Novedades de la v{version}
          </p>
          <div className="flex flex-col gap-2 text-sm text-ink-soft">
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
  );
}

// ------------------------------------------------------------- Hero + mockup

function VentanaWindows({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface-2 px-3 py-2">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <Image src={src} alt={alt} width={1600} height={1000} className="h-auto w-full" priority />
    </div>
  );
}

const PUNTOS_CLAVE = ["Sin internet", "Datos locales", "Licencia flexible"];

export function HeroRediseno({
  version,
  fechaFormateada,
  novedades,
  descargaUrl,
  whatsappProbar,
}: {
  version: string | null;
  fechaFormateada: string | null;
  novedades: BloqueNovedades[];
  descargaUrl: string | null;
  whatsappProbar: string | null;
}) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          {version && (
            <div className="mb-5">
              <PildoraVersion version={version} fechaFormateada={fechaFormateada} novedades={novedades} />
            </div>
          )}

          <h1 className="font-display mb-4 bg-gradient-to-r from-ink to-accent bg-clip-text text-4xl leading-[1.05] text-transparent sm:text-5xl md:text-6xl">
            El sistema de caja e inventario que funciona sin internet
          </h1>

          <p className="mb-7 max-w-md text-lg text-ink-soft">
            Caja registradora e inventario para tiendas pequeñas. Cobra tus ventas y lleva tu
            inventario desde tu computador, incluso sin conexión.
          </p>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            {descargaUrl && (
              <a
                href={descargaUrl}
                download
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-base font-bold text-accent-ink shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
              >
                <Download aria-hidden="true" className="h-5 w-5" />
                Descargar para Windows{version ? ` (v${version})` : ""}
              </a>
            )}
            {whatsappProbar && (
              <a
                href={whatsappProbar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-line-strong px-6 py-4 text-base font-bold text-wa-deep transition-colors hover:bg-ink/5"
              >
                <WhatsappIcon width={18} height={18} />
                Escríbenos por WhatsApp
              </a>
            )}
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {PUNTOS_CLAVE.map((punto) => (
              <li key={punto} className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 flex-none fill-wa-deep">
                  <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.79 6.8-6.79a1 1 0 0 1 1.4 0Z" />
                </svg>
                {punto}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <VentanaWindows src={CAPTURAS[0].src} alt={CAPTURAS[0].alt} />
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------- Casos de uso

const CASOS_DE_USO = [
  { icono: Store, texto: "Misceláneas y tiendas de barrio" },
  { icono: Hammer, texto: "Papelerías y ferreterías" },
  { icono: Shirt, texto: "Tiendas de ropa y comercio local" },
];

export function CasosDeUso() {
  return (
    <section aria-labelledby="ideal-para" className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h2 id="ideal-para" className="font-display mb-6 text-center text-2xl">
        Ideal para...
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {CASOS_DE_USO.map(({ icono: Icono, texto }) => (
          <li
            key={texto}
            className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface p-6 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icono aria-hidden="true" className="h-6 w-6" />
            </span>
            <span className="text-sm font-semibold text-ink">{texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// -------------------------------------------------- Galería con pestañas

export function GaleriaTabs() {
  const [activa, setActiva] = useState(0);
  const actual = CAPTURAS[activa];
  const descripcion = FUNCIONES[Math.min(activa, FUNCIONES.length - 1)].texto;

  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="scroll-mt-20 bg-surface-2 py-14"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2 id="como-funciona-titulo" className="font-display mb-6 text-center text-2xl">
          Así se ve
        </h2>

        <div role="tablist" aria-label="Capturas de CajaSimple" className="mb-6 flex flex-wrap justify-center gap-2">
          {CAPTURAS.map((captura, i) => (
            <button
              key={captura.src}
              type="button"
              role="tab"
              id={`tab-${i}`}
              aria-selected={activa === i}
              aria-controls={`panel-${i}`}
              onClick={() => setActiva(i)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                activa === i
                  ? "bg-accent text-accent-ink"
                  : "bg-surface text-ink-soft hover:bg-ink/5"
              }`}
            >
              {captura.titulo}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${activa}`}
          aria-labelledby={`tab-${activa}`}
          className="mx-auto max-w-3xl"
        >
          <Image
            key={actual.src}
            src={actual.src}
            alt={actual.alt}
            width={1600}
            height={1000}
            className="h-auto w-full rounded-xl border border-line shadow-lg"
          />
          <p className="mt-4 text-center text-sm text-ink-soft">{descripcion}</p>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------- Características (bento)

export function CaracteristicasBento() {
  return (
    <section
      id="caracteristicas"
      aria-labelledby="caracteristicas-titulo"
      className="scroll-mt-20 mx-auto max-w-5xl px-5 py-14 sm:px-8"
    >
      <h2 id="caracteristicas-titulo" className="font-display mb-8 text-center text-2xl">
        Qué hace CajaSimple
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FUNCIONES.map(({ icono: Icono, titulo, texto }) => (
          <li
            key={titulo}
            className="rounded-xl border border-line-strong/80 bg-surface p-5 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icono aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="mb-1 font-semibold text-ink">{titulo}</h3>
            <p className="text-sm text-ink-soft">{texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ------------------------------------------------------------- Instalación

const PASOS_INSTALACION = [
  {
    titulo: "Descarga el instalador",
    texto: 'Pulsa «Descargar para Windows». Se guarda un archivo que termina en «-setup.exe».',
  },
  {
    titulo: "Ábrelo",
    texto:
      'Haz doble clic en el archivo descargado. Si Windows muestra una pantalla azul, es normal: el instalador todavía no tiene certificado de firma de Microsoft.',
  },
  {
    titulo: "Sigue el asistente",
    texto: 'El asistente sale en español: pulsa «Siguiente», «Instalar» y, al terminar, «Finalizar».',
  },
  {
    titulo: "Abre CajaSimple",
    texto:
      "Búscalo en el menú Inicio y ábrelo. Acepta los términos, sigue la bienvenida y activa el programa con la clave que te enviamos.",
  },
];

export function InstalacionRediseno() {
  return (
    <section
      id="instalacion"
      aria-labelledby="instalacion-titulo"
      className="scroll-mt-20 bg-surface-2 py-14"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 id="instalacion-titulo" className="font-display mb-8 text-center text-2xl">
          Instalación en 4 pasos
        </h2>

        <ol className="mb-6 flex flex-col gap-5">
          {PASOS_INSTALACION.map((paso, i) => (
            <li key={paso.titulo} className="flex gap-4 rounded-xl border border-line bg-surface p-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink"
              >
                {i + 1}
              </span>
              <div className="text-sm text-ink-soft">
                <p className="font-semibold text-ink">{paso.titulo}</p>
                <p>{paso.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <details className="group rounded-xl border border-line bg-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            ¿Qué hacer si Windows muestra la pantalla azul?
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 flex-none text-ink-soft transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="flex flex-col gap-4 px-5 pb-5 text-sm text-ink-soft">
            <p className="rounded-lg bg-accent-soft px-3 py-2 font-semibold text-accent">
              Pulsa «Más información» y luego «Ejecutar de todas formas». Hazlo solo si descargaste el
              archivo desde esta página.
            </p>
            <p className="rounded-lg bg-accent-soft px-3 py-2 font-semibold text-accent">
              Tu navegador también puede decir que el archivo «no se descarga habitualmente». Es
              normal: pulsa «Conservar» y, si vuelve a preguntar, «Mostrar más» y luego «Conservar de
              todos modos».
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
          </div>
        </details>
      </div>
    </section>
  );
}

// ---------------------------------------------------- Licencia destacada

export function LicenciaDestacada() {
  return (
    <section
      aria-labelledby="licencia-titulo"
      className="mx-auto max-w-3xl px-5 py-14 sm:px-8"
    >
      <div className="rounded-2xl border border-accent/30 bg-accent-soft p-6 sm:p-8">
        <h2 id="licencia-titulo" className="font-display mb-4 text-2xl text-ink">
          Cómo funciona la licencia
        </h2>
        <Lista
          items={[
            "Se pide por WhatsApp.",
            <>
              Se activa <strong className="text-ink">una sola vez, con internet</strong>. Después
              funciona sin conexión.
            </>,
            "Es por periodos.",
            <>
              Si vence, tienes <strong className="text-ink">15 días de gracia</strong>. Después, el
              programa <strong className="text-ink">nunca te impide vender</strong>: solo se limitan
              funciones complementarias, como imprimir etiquetas y el PDF del cierre.
            </>,
            <>
              Funciona en <strong className="text-ink">un computador a la vez</strong>. Si cambias de
              computador, te la pasamos en minutos.
            </>,
          ]}
        />
      </div>
    </section>
  );
}
